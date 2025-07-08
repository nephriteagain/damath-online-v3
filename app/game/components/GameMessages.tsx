import Button from "@/components/Button"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useAsyncStatus } from "@/hooks/useAsyncStatus"
import { authSelector } from "@/store/auth/auth.store"
import { sendGameMessage } from "@/store/game/game.action"
import { gameSelector } from "@/store/game/game.store"
import { capitalize } from "lodash"
import { MessageCircle, ChevronDown } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { toast } from "sonner"

const OFFSET = 48;

export default function GameMessages() {

    const [showScrollToBottom, setShowScrollToBottom] = useState(false)
    const [text, setText] = useState("")
    const user = authSelector.use.user();
    const messagesRef = useRef<HTMLDivElement>(null)
    const gameMessages = gameSelector.use.messages();
    const gameType = gameSelector.use.gameType();
    const playerColor = gameSelector.use.playerColors();
    const gameId = gameSelector.use.gameId();
    const [sendGameMessageFn, gameMessageLoading] = useAsyncStatus(sendGameMessage)
    const [isOpen, setIsOpen] = useState(false)
    const [hasNewMessages, setHasNewMessages]  = useState(false)


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
      }, [gameMessages.length]);

    // logic to add a dot in the message icon
    // when user receive a new messages
    useEffect(() => {
        if (!isOpen) {
            setHasNewMessages(true)
        } else {
            setHasNewMessages(false)
        }
    }, [gameMessages.length])
    useEffect(() => {
        if (isOpen) {
            setHasNewMessages(false)
        }
    }, [isOpen])
    //-----------------------------------------------//

  return (
    <Sheet onOpenChange={o => setIsOpen(o)}>
      <SheetTrigger asChild>
        <Button variant="outline" size={"icon"} className="relative">
            <MessageCircle />
            { hasNewMessages && <span className="w-3 h-3 absolute -top-1 -left-1 bg-red-700 rounded-full" />}
        </Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-scroll">
        <SheetHeader>
          <SheetTitle>Game Chat</SheetTitle>
          <SheetDescription>
            Game type: {capitalize(gameType)}
          </SheetDescription>
          <div className="w-full flex flex-row">
            <div className="w-1/2 pe-1 flex flex-col gap-y-1">
                <h3 className="font-bold">HOST</h3>
                <h2 className="break-words whitespace-normal">{playerColor?.host?.uid}</h2>
            </div>
            <div className="w-1/2 ps-1 flex flex-col gap-y-1">
                <h3 className="font-bold">GUEST</h3>
                <h2 className="break-words whitespace-normal">{playerColor?.guest?.uid}</h2>
            </div>
          </div>
        </SheetHeader>
       
        <SheetFooter>
        <div className="w-full flex flex-col gap-y-3 pb-2 h-full">
          <div className="relative">
          <div className="bg-accent rounded-md shadow-md  h-120 overflow-y-scroll p-2 flex flex-col gap-y-2 pb-12" ref={messagesRef}>
            {
                gameMessages.length > 0 ?
                gameMessages.map((message, index) => {
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
        <form className="flex flex-col gap-y-3" onSubmit={async(e) => {
            e.preventDefault();
            if (!gameId) {
                toast("Game id not found.")
                return;
            }
            await sendGameMessageFn(gameId, text)
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
            disabled={gameMessageLoading}
            />
            <Button 
            loading={gameMessageLoading} 
            disabled={text.length === 0} >Send</Button>
          </form>
          </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
