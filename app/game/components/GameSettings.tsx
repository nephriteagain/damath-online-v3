import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { logout } from "@/store/auth/auth.action"
import { Settings } from "lucide-react"

export default function GameSettings() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">
            <Settings />
            <p>Settings</p>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-50">
       <div className="w-full flex flex-col gap-y-4">
        <Button variant={"ghost"} className="w-full" onClick={logout}>Quit Game</Button>
       </div>
      </PopoverContent>
    </Popover>
  )
}
