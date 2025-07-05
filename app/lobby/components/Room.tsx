import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Dispatch, SetStateAction, useState } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { GAME_TYPE_ARR } from "@/lib/constants";
import { capitalize } from "lodash"

const conversation: { type: "host" | "guest"; message: string }[] = [
    { type: "host", message: "Hey! Welcome to the event. Did you find the place okay?" },
    { type: "guest", message: "Hey! Yeah, it was pretty easy to find. The signs helped a lot." },
    { type: "host", message: "Awesome, glad to hear that. Have you checked in already?" },
    { type: "guest", message: "Not yet, I wasn't sure where to go first." },
    { type: "host", message: "No worries! Just head to the front desk and they'll get you sorted." },
    { type: "guest", message: "Great, thanks! This place looks amazing, by the way." },
    { type: "host", message: "Thanks! We’ve been working on it for weeks. The main session starts in 30 minutes." },
    { type: "guest", message: "Perfect. Is there coffee or snacks around while we wait?" },
    { type: "host", message: "Yep, we’ve got a refreshment table to the left of the stage. Help yourself!" },
    { type: "guest", message: "Awesome, I’ll grab something before it starts. Appreciate the help!" },
    { type: "host", message: "Anytime! Let me know if you need anything else." },
    { type: "guest", message: "Will do. Looking forward to the talks!" },
];
  
  

export function Room({room, setRoom}:{room: string|null; setRoom: Dispatch<SetStateAction<string|null>>}) {
    const [isOpen, setIsOpen] = useState(true)

  return (
    <Sheet defaultOpen onOpenChange={(o) => setIsOpen(o)}>
      <SheetTrigger asChild>
        <Button variant="outline">{isOpen ? "Hide Room" : "Show Room"}</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Room {room}</SheetTitle>
          <Select>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Game Type" />
            </SelectTrigger>
            <SelectContent>
                {
                    GAME_TYPE_ARR.map(type => (
                        <SelectItem key={type} value={type}>{capitalize(type)}</SelectItem>
                    ))
                }
            </SelectContent>
        </Select>
          <div className="flex flex-row gap-x-4">
            <div className="flex-grow-1">
                <h3>HOST</h3>
                <h2>Nephrite Again</h2>
            </div>
            <div className="flex-grow-1">
                <h3>GUEST</h3>
                <h2>Kidney God</h2>
            </div>
          </div>
         
        </SheetHeader>
        <div className="pt-12 flex flex-col gap-y-3 px-4 h-full">
          <div className="flex flex-col gap-y-3">
            <Input id="room-send-msg" className="bg-muted" placeholder="Send a message..." />
            <Button>Send</Button>
          </div>
          <div className="bg-accent rounded-md shadow-md  h-100 overflow-y-scroll p-2 flex flex-col gap-y-2">
            {
                conversation.map((message, index) => {
                    if (message.type ==="host") {
                        return (
                            <div className="w-fit max-w-64 self-end px-2 py-1" key={index}>
                                <p className="text-end">{message.message}</p>
                                <p className="text-sm text-shadow-muted-foreground text-end">you</p>
                            </div>
                        )
                    }    
                    return (
                        <div className="w-fit self-start px-2 py-1" key={index}>
                            <p className="text-start">{message.message}</p>
                            <p className="text-sm text-muted-foreground text-start">guest</p>
                        </div>
                    )
                })
            }
          </div>
        </div>
        <SheetFooter className="flex-grow">
          <Button type="submit">Start Game</Button>
          <SheetClose asChild>
            <Button variant="destructive" onClick={() => setRoom(null)} >Leave Room</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
