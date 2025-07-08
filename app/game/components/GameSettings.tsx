import Button from "@/components/Button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Settings } from "lucide-react"
import { quitGame, exitGame } from "@/store/game/game.action"
import { gameSelector } from "@/store/game/game.store"
import { lobbySelector } from "@/store/lobby/lobby.store"
import { useAsyncStatus } from "@/hooks/useAsyncStatus"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function GameSettings() {

  const gameId = gameSelector.use.gameId();
  const isGameOver = gameSelector.use.isGameOver();
  const [quitGameFn, quitGameLoading] = useAsyncStatus(quitGame)
  const [exitGameFn, exitGameLoading] = useAsyncStatus(exitGame)


  const router = useRouter()

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
        <Button
        loading={quitGameLoading || exitGameLoading}
        variant={"ghost"} 
        className="w-full" 
        onClick={() => {
          if (!gameId) {
            toast("No game id found.")
            return;
          }
          if (isGameOver) {
            exitGameFn(gameId)
          } else {
            quitGameFn(gameId)
          }
          lobbySelector.setState({
            ongoingGameId: null
        })
          router.push("/lobby")
        
        }}>Leave Game</Button>
       </div>
      </PopoverContent>
    </Popover>
  )
}
