import Button from "@/components/Button";
import { Input } from "@/components/ui/input"
import {
  Sheet,
  // SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useRef, useState, useEffect } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { GAME_TYPE, GAME_TYPE_ARR } from "@/lib/constants";
import { capitalize } from "lodash"
import { leaveRoom, changeRoomGameType, sendRoomMessage, updateRoomName, kickGuest, startGame } from "@/store/lobby/lobby.action";
import { Room } from "@/types/lobby.types";
import { useAsyncStatus } from "@/hooks/useAsyncStatus";
import { authSelector } from "@/store/auth/auth.store";
import { Check, ChevronDown, Edit, X } from "lucide-react";
import { toast } from "sonner";

  
const OFFSET = 48;
export default function RoomSheet({room}:{room: Room}) {
   

    const [changeRoomGameTypeFn, gameTypeLoading] = useAsyncStatus(changeRoomGameType)
    const [sendRoomMessageFn, messageLoading] = useAsyncStatus(sendRoomMessage)
    const [updateRoomNameFn, updateRoomNameLoading] = useAsyncStatus(updateRoomName)
    const [kickGuessFn, kickGuessLoading] = useAsyncStatus(kickGuest)
    const [startGameFn, startGameLoading] = useAsyncStatus(startGame)

    const [showScrollToBottom, setShowScrollToBottom] = useState(false)
    const user = authSelector.use.user();
    const messagesRef = useRef<HTMLDivElement>(null)

    // room name
    const [roomName, setRoomName] = useState(room.name)
    const [isEditMode, setIsEditMode] = useState(false)

    // room sheet modal
    const [isOpen, setIsOpen] = useState(true)

    // message text
    const [text, setText] = useState("")

    useEffect(() => {
      setRoomName(room.name)
    }, [room.name])

    useEffect(() => {
      const container = messagesRef.current;
      if (!container) return;
    
      const handleScroll = () => {
        const nearBottom =
          container.scrollTop + container.clientHeight >= container.scrollHeight - OFFSET;
    
        const isOverflowing =
          container.scrollHeight > container.clientHeight;
    
        setShowScrollToBottom(isOverflowing && !nearBottom);
      };
    
      handleScroll(); // Initial check
      container.addEventListener("scroll", handleScroll);
    
      return () => {
        container.removeEventListener("scroll", handleScroll);
      };
    }, [room.messages.length]);
    

  return (
    <Sheet defaultOpen onOpenChange={(o) => setIsOpen(o)}>
      <SheetTrigger asChild>
        <Button variant="outline">{isOpen ? "Hide Room" : "Show Room"}</Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-scroll">
        <SheetHeader>
          {
             room.host === user?.uid ? 
             <div className="flex flex-row items-center gap-x-2">
              { isEditMode ? 
              <>
                <Button 
                loading={updateRoomNameLoading} 
                size={"icon"} 
                variant={"outline"} 
                onClick={async() => {
                  await updateRoomNameFn(room.roomId, roomName)
                  toast("Room name updated.")
                  setIsEditMode(false)
                  }}>
                  <Check />
                </Button>
                <Button
                size={"icon"} 
                variant={"outline"} 
                onClick={() => setIsEditMode(false)}
                className="border-destructive/20 hover:bg-destructive/20"
                >
                  <X className="text-destructive" />
                </Button>
                </> :
              <Button size={"icon"} variant={"ghost"} onClick={() => {
                setIsEditMode(true)
                setRoomName(room.name)
                }}>
                <Edit />
              </Button>
              }
              {
                isEditMode ?
                <Input
                  value={roomName}
                  className="w-54" 
                  onChange={(e) => setRoomName(e.currentTarget.value)}
                  disabled={updateRoomNameLoading}
                  maxLength={50}
                /> :
                <SheetTitle className="w-54">{room.name}</SheetTitle>
                
              }
              
              {/* will trigger an error if no sheet title */}
              <SheetTitle className="hidden">Room {room.name}</SheetTitle>
            </div> :
          <SheetTitle>Room {room.name}</SheetTitle>
          }
          <Select value={room.gameType} onValueChange={(v) => {
            changeRoomGameTypeFn(room.roomId, v as GAME_TYPE)
          }}>
            <SelectTrigger className="w-28" disabled={gameTypeLoading}>
                <SelectValue placeholder={capitalize(room.gameType)} />
            </SelectTrigger>
            <SelectContent> 
                {
                    GAME_TYPE_ARR.map(type => (
                        <SelectItem key={type} value={type}>
                          {capitalize(type)}
                        </SelectItem>
                    ))
                }
            </SelectContent>
        </Select>
          <div className="w-full flex flex-row">
            <div className="w-1/2 pe-1 flex flex-col gap-y-1">
                <h3 className="font-bold">HOST</h3>
                <h2 className="break-words whitespace-normal">{room.host}</h2>
            </div>
            <div className="w-1/2 ps-1 flex flex-col gap-y-1">
                <h3 className="font-bold">GUEST</h3>
                <h2 className="break-words whitespace-normal">{room.guest}</h2>
                { user && room.host === user.uid &&
                  room.guest && 
                <Button 
                loading={kickGuessLoading} 
                variant={"destructive"} 
                size={"sm"}
                className="w-full" 
                onClick={() => kickGuessFn(room.roomId)}>
                  KICK
                </Button>
                }
            </div>
          </div>
         
        </SheetHeader>
        <SheetFooter className="flex-grow">
          <div className="flex flex-col gap-y-3 py-8 h-full">
            <form className="flex flex-col gap-y-3" onSubmit={async(e) => {
              e.preventDefault();
              await sendRoomMessageFn(room.roomId, text)
              setText("")
              messagesRef.current?.scrollTo({
                top: messagesRef.current.scrollHeight,
                behavior: 'smooth'
              });
            }}>
              <Input 
              id="room-send-msg" 
              className="bg-muted" 
              placeholder="Send a message..." 
              value={text} 
              onChange={e =>setText(e.currentTarget.value)} 
              disabled={messageLoading}
              />
              <Button loading={messageLoading} disabled={text.length === 0} >Send</Button>
            </form>
            <div className="relative">
            <div className="bg-accent rounded-md shadow-md  h-75 overflow-y-scroll p-2 flex flex-col gap-y-2 pb-12" ref={messagesRef}>
              {
                  room.messages.length > 0 ?
                  room.messages.map((message, index) => {
                      if (message.senderId === user?.uid) {
                          return (
                              <div className="w-fit max-w-64 self-end px-2 py-1" key={index}>
                                  <p className="text-end">{message.text}</p>
                                  <p className="text-sm text-shadow-muted-foreground text-end">you</p>
                              </div>
                          )
                      }    
                      return (
                          <div className="w-fit self-start px-2 py-1" key={index}>
                              <p className="text-start">{message.text}</p>
                              <p className="text-sm text-muted-foreground text-start">
                                {message.senderId}
                              </p>
                          </div>
                      )
                  }) :
                  <p>No messages yet.</p>
              }
              { showScrollToBottom && <Button
              variant={"secondary"} 
              className="absolute bottom-2 left-1/2 -translate-x-1/2 flex flex-row items-center gap-x-1"
              onClick={() => {
                messagesRef.current?.scrollTo({
                  top: messagesRef.current.scrollHeight,
                  behavior: "smooth",
                });
              }}
              >
                <p className="text-sm">Scroll to bottom</p>
                <ChevronDown className="w-4 h-4" />
              </Button>}
            </div>
            </div>
          </div>
          { user?.uid === room.host && <Button onClick={() => startGameFn(room.roomId)} loading={startGameLoading}>Start Game</Button>}
          {/* <SheetClose asChild> */}
            <Button variant="destructive" onClick={()=> {
              console.log(room.roomId)
              leaveRoom(room.roomId)
              }}>Leave Room</Button>
          {/* </SheetClose> */}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
