import { collection, doc, getDocs, limit, or, query, serverTimestamp, setDoc, Timestamp, where, onSnapshot, Unsubscribe, runTransaction, arrayUnion, orderBy } from "firebase/firestore"
import { authSelector } from "../auth/auth.store"
import { firestore } from "@/lib/firebase"
import { COL, GAME_TYPE } from "@/lib/constants"
import { MESSAGE_TYPE, Room, RoomDoc, RoomMessage } from "@/types/lobby.types"
import { capitalize } from "lodash"
import { lobbySelector } from "./lobby.store"
import { toast } from "sonner"

export async function createRoom(gameType: GAME_TYPE) {
    const user = authSelector.getState().user
    if (!user) {
        throw new Error("Cannot create lobby without user account.")
    }
        // check if user already in a lobby
    const roomRef = collection(firestore, COL.ROOMS)
    const roomQ = query(
        roomRef, 
        or(
            where("host", "==", user.uid),
            where("guest", "==", user.uid),
        ),
        limit(1)
    )
    const roomSnaps = await getDocs(roomQ)
    if (roomSnaps.docs.length > 0) {
        throw new Error("Already joined in another lobby.")
    }
    const newRoomRef = doc(collection(firestore, COL.ROOMS))
    const roomMessageRef = collection(newRoomRef, COL.ROOM_MESSAGES)
    const roomObject : RoomDoc = {
        roomId: newRoomRef.id,
        name: `${capitalize(gameType)}-${user.uid.slice(0,5)}`,
        host: user.uid,
        guest: null,
        gameType,
        gameStarted: false,
        messages: roomMessageRef.path,
        createdAt: serverTimestamp(),   
        updateLogs: [{
            updatedAt: Timestamp.now(),
            log: `${user.uid} has created a ${gameType} room.`
        }]
    }
    await setDoc(newRoomRef,roomObject)


    lobbySelector.setState({
        joinedRoom: {
            roomId: roomObject.roomId,
            name: roomObject.name,
            host: roomObject.host,
            guest: roomObject.guest,
            gameType: roomObject.gameType,
            gameStarted: roomObject.gameStarted, 
            messages: []
        }
    })

    return true;
}

export function onRoomsSnapshot(filter?: GAME_TYPE|null) {
    const roomsRef = collection(firestore, COL.ROOMS)
    const roomsQ = filter ? query(roomsRef, where("gameType", "==", filter)) : query(roomsRef);
    const unsub = onSnapshot(roomsQ, (snap) => {
        const docs = snap.docs.map(d => d.data() as RoomDoc);
        const rooms : Room[] = docs.map(d => ({
            name: d.name,
            host: d.host,
            guest: d.guest,
            gameType: d.gameType,
            gameStarted: d.gameStarted,
            roomId: d.roomId,
            messages: []
        }))
        lobbySelector.setState({
            rooms
        })
    })
    
    return unsub;
}

export function onJoinedRoomSnapshot(roomId :string) {
    const roomRef = doc(firestore, COL.ROOMS, roomId)
    const roomMessagesRef = collection(firestore, COL.ROOMS, roomId, COL.ROOM_MESSAGES)
    const user = authSelector.getState().user

    // listen to the room changes
    const roomUnsub  = onSnapshot(roomRef, snap => {
        console.log("joined room updated.")
        const data = snap.data() as RoomDoc | undefined;

        const joinedRoom = lobbySelector.getState().joinedRoom;
        const joinedRoomAsGuest = joinedRoom && user && joinedRoom.host && joinedRoom.guest === user.uid

        // if room is not found, it's probably deleted by host
        // or expired
        if (!data) {   
            console.warn(`room ${roomId} not found!`)


            // alert guest user that the room is no longer available
            if (joinedRoomAsGuest) {
                toast(`The room "${joinedRoom.name}" is no longer available.`)
            }

            lobbySelector.setState({
                joinedRoom: null
            })
            return
        }
        
        // guest user is kicked from the room
        if (joinedRoomAsGuest && data.guest === null) {
            toast("You are kicked from the room.")
            lobbySelector.setState({
                joinedRoom: null
            })
            return
        }

        lobbySelector.setState((s) => {
            const updatedRoom = {
                name: data.name,
                guest: data.guest,
                gameStarted: data.gameStarted,
                gameType: data.gameType
            } as const
            console.log({updatedRoom})
            // edge case
            if (!s.joinedRoom) {
                return {
                    joinedRoom: {
                        ...updatedRoom,
                        roomId,
                        host: data.host,
                        messages: []
                    }
                }
            }
            return {
                // we only update the items that can change
                joinedRoom: {
                    ...s.joinedRoom,
                    ...updatedRoom
                }
            }

        })
    })

    // listen to the room messages
    const roomMessagesQ = query(roomMessagesRef, orderBy("sentAt", "asc"))
    const messagesUnsub = onSnapshot(roomMessagesQ, snap => {
        const messages = snap.docs.map(d => d.data()) as RoomMessage[];
        lobbySelector.setState(s => {
            if (!s.joinedRoom) return s
            return {
                joinedRoom: {
                    ...s.joinedRoom,
                    messages
                }
            }
        })
    })

    const unsub : Unsubscribe = () => {
        roomUnsub();
        messagesUnsub();
    }

    return unsub
}


export async function leaveRoom(roomId: string) {
    const user = authSelector.getState().user
    if (!user) {
        throw new Error("Cannot leave room without user account.")
    }
    console.log("leaving room...")

    const roomRef = doc(firestore, COL.ROOMS, roomId)

    const transactionResult = await runTransaction(firestore, async t => {
        const roomSnap = await t.get(roomRef) 
        const room = roomSnap.data() as RoomDoc|undefined;
        if (!room) {
            // room already deleted
            throw new Error("Room is already deleted")
        }
        const isGuest = room.guest === user.uid
        if (isGuest) {
            console.log("leaving room as guest...")
            t.update(roomRef, {
                guest: null,
                updatedAt: serverTimestamp(),
                updateLogs: arrayUnion({
                    updatedAt: Timestamp.now(),
                    log: `${user.uid} has left the room.`
                })
            })
            return true
        }
        console.log("deleting room...")
        t.delete(roomRef)
        return true
    })
    lobbySelector.setState({joinedRoom: null})
    return transactionResult;
}

export async function changeRoomGameType(roomId: string, newGameType: GAME_TYPE) {
    const user = authSelector.getState().user;
    if (!user) {
        throw new Error("Cannot change room game type without user account.")
    }
    const roomRef = doc(firestore, COL.ROOMS, roomId)
    const transactionResult = await runTransaction(firestore, async t => {
        const roomSnap = await t.get(roomRef) 
        const room = roomSnap.data() as RoomDoc|undefined;
        if (!room) {
            // room already deleted
            throw new Error("Room is already deleted")
        }
        if (room.host !== user.uid) {
            throw new Error("Only host can change room game type.")
        }
        t.update(roomRef, {
            gameType: newGameType,
            updatedAt: serverTimestamp(),
            updateLogs: arrayUnion({
                updatedAt: Timestamp.now(),
                log: `${user.uid} has changed the room game type to ${newGameType}.`
            })
        })
        return true
    })
    return transactionResult;
}

export async function joinRoom(roomId: string) {
    const user = authSelector.getState().user;
    if (!user) {
        throw new Error("Cannot join room without user account.")
    }
    const roomRef = doc(firestore, COL.ROOMS, roomId)
    const transactionResult = await runTransaction(firestore, async t => {
        const roomSnap = await t.get(roomRef) 
        const room = roomSnap.data() as RoomDoc|undefined;
        if (!room) {
            // room already deleted
            throw new Error("Room is already deleted")
        }
        if (room.guest) {
            // room already full
            throw new Error("Room is already full")
        }
        t.update(roomRef, {
            guest: user.uid,
            updatedAt: serverTimestamp(),
            updateLogs: {
                updatedAt: Timestamp.now(),
                log: `${user.uid} has joined the room.`
            }
        })
        const joinedRoom = {
            roomId,
            name: room.name,
            host: room.host,
            guest: user.uid,
            gameType: room.gameType,
            gameStarted: room.gameStarted,
            messages: []
        }
        
        return joinedRoom;
    })
   
    lobbySelector.setState({joinedRoom: transactionResult})
    
    return transactionResult;
}

export async function sendRoomMessage(roomId: string, text: string) {
    const user = authSelector.getState().user;
    if (!user) {
        throw new Error("Cannot send room message without user account.")
    }
    const roomRef = doc(firestore, COL.ROOMS, roomId)
    const roomMessagesRef = doc(collection(roomRef, COL.ROOM_MESSAGES))
    const messageObject : RoomMessage = {
        messageId: roomMessagesRef.id,
        senderId: user.uid,
        text,
        sentAt: Timestamp.now(),
        roomId,
        messageType: MESSAGE_TYPE.ROOM
    }
    await setDoc(roomMessagesRef, messageObject)
    return true;
}

export async function updateRoomName(roomId: string, newName: string) {
    const user = authSelector.getState().user;
    if (!user) {
        throw new Error("Cannot update room without user account.")
    }
    const transaction = await runTransaction(firestore, async t => {
        const roomRef = doc(firestore, COL.ROOMS, roomId)
        const roomSnap = await t.get(roomRef)
        const room = roomSnap.data() as RoomDoc|undefined;
        if (!room) {
            throw new Error("Room not found.")
        }
        const isHost = room.host === user.uid;
        if (!isHost) {
            throw new Error("Only host can update room name.")
        }
       t.update(roomRef, {
            name: newName,
            updatedAt: serverTimestamp(),
            updateLogs: arrayUnion({
                updatedAt: Timestamp.now(),
                log: `${user.uid} has updated the room name from ${room.name} to ${newName}.`
        })
       })
       return true
    })
    return transaction
}

export async function kickGuest(roomId: string) {
    const user = authSelector.getState().user;
    if (!user) {
        throw new Error("Cannot kick guest without user account.")
    }
    const transaction = await runTransaction(firestore, async t => {
        const roomRef = doc(firestore, COL.ROOMS, roomId)
        const roomSnap = await t.get(roomRef)
        const room = roomSnap.data() as RoomDoc|undefined;
        if (!room) {
            throw new Error("Room not found.")
        }
        const isHost = room.host === user.uid;
        if (!isHost) {
            throw new Error("Only host can update room name.")
        }
       t.update(roomRef, {
            guest: null,
            updatedAt: serverTimestamp(),
            updateLogs: arrayUnion({
                updatedAt: Timestamp.now(),
                log: `${user.uid} has been kicked from the room.`
            })
       })
       return true
    })
    return transaction
}