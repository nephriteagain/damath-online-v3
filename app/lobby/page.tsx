"use client"

import Button from "@/components/Button"
import Room from "./components/Room"
import GameTypeFilter from "@/components/GameTypeFilter"
import LobbyTable from "@/components/Lobby"
import Link from "next/link"
import { lobbySelector } from "@/store/lobby/lobby.store"
import { createRoom, onRoomsSnapshot, onJoinedRoomSnapshot } from "@/store/lobby/lobby.action"
import { GAME_TYPE } from "@/lib/constants"
import { useAsyncStatus } from "@/hooks/useAsyncStatus"
import { useEffect } from "react"
import { authSelector } from "@/store/auth/auth.store"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function LobbyPage() {
    const rooms = lobbySelector.use.rooms();
    const joinedRoom = lobbySelector.use.joinedRoom();
    const gameTypeFilter = lobbySelector.use.gameTypeFilter();
    const onGoingGameId = lobbySelector.use.ongoingGameId()

    const [createRoomFn, isLoading] = useAsyncStatus(createRoom)
    const user =  authSelector.use.user();
    const router = useRouter();

    useEffect(() => {
        console.log("roomsSnapshot effect")
        const unsub = onRoomsSnapshot(gameTypeFilter)
        return () => {
            unsub()
        }
    }, [gameTypeFilter])


    useEffect(() => {
        if (!joinedRoom) return;
        console.log("joinedRoomSnapshot effect")
        const unsub = onJoinedRoomSnapshot(joinedRoom.roomId)
        return () => {
            unsub()
        }
    }, [joinedRoom?.roomId])

    useEffect(() => {
        if (onGoingGameId) {
            router.push(`/game/pvp-online`)
        }
    }, [onGoingGameId])

    
    return (
        <main className="flex flex-col items-center justify-center h-screen">
            <div className="w-full flex flex-col gap-y-6 p-4 max-w-150 bg-secondary h-180 rounded-lg shadow-lg">
                <div className="flex flex-row justify-between items-center">
                    {    joinedRoom?.roomId ?
                        <Room room={joinedRoom} /> :
                        <Button loading={isLoading} onClick={() => {
                            if (!user) {
                                toast("You need an signin to create a room.", {
                                    action: {
                                        label: "Sign In",
                                        onClick: () => router.push("/auth")
                                    }
                                })
                                return;
                            }
                            createRoomFn(GAME_TYPE.COUNTING)
                        }}>Create Room</Button>
                    }
                    <GameTypeFilter />
                </div>
                <div className="w-full flex flex-col flex-grow-1 bg-foreground justify-between pb-2 rounded-md shadow-md overflow-y-scroll">
                    <LobbyTable rooms={rooms} />
                    <Link href={"/"} className="self-center">
                        <Button variant={"link"}>Back to Home</Button>
                    </Link>
                </div>
            </div>
        </main>
    )
}