import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { logout } from "@/store/auth.store.ts/auth.action"
import { AuthStoreState } from "@/store/auth.store.ts/auth.store";
import { Settings } from "lucide-react"
import Link from "next/link";

export default function UserMenu({displayName, uid, signInMethod}:{displayName: string|null; uid: string; signInMethod: AuthStoreState["signInMethod"]}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-50">
            <Settings />
            {displayName ? displayName : `Guess #${uid.slice(0,10)}`}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-50">
       <div className="w-full flex flex-col gap-y-4">
        {signInMethod === "anonymous" && 
        <Link href={"/auth"}>
            <Button variant={"ghost"} className="w-full">Complete Your Signup</Button>
        </Link>
        }
        <Button variant={"ghost"} className="w-full" onClick={logout}>Logout</Button>
       </div>
      </PopoverContent>
    </Popover>
  )
}
