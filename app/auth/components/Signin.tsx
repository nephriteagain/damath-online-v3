"use client"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {  useAsyncAction } from "@/hooks/useAsyncAction"
import { linkAnonymousUserWithGoogle, signInAsGuest, signInUsingGoogle } from "@/store/auth/auth.action"
import { authSelector } from "@/store/auth/auth.store"
import Link from "next/link"

export default function SignIn() {

  const user = authSelector.use.user();

  const [signInAsGuestFn] = useAsyncAction(signInAsGuest)

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>
          {
            user?.isAnonymous ?
            <>
            Complete you Signup
            </>:
            <>
            Sign in to your account
            </>
          }
          </CardTitle>
        <CardDescription>
          {
            user?.isAnonymous ?
            <>
            Complete your signup to personalize your account, sync it across devices, and keep your recent matches.</>:
            <>
            Sign in using a google account to continue<br/>
            Or sign in using a guess account instead.
            </>
          }
         
        </CardDescription>
        <CardAction>
            <Link href={"/"} replace>
                <Button variant="link">Go Back</Button>
            </Link>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-y-4">
        { user && user.isAnonymous &&
          <Button className="w-full" onClick={linkAnonymousUserWithGoogle}>
            Link you guest account to Google 
          </Button>
        }
        { !user && <>
        <Button className="w-full" onClick={signInUsingGoogle}>
          Login with Google
        </Button>
        <Button type="submit" className="w-full" variant={"outline"} onClick={signInAsGuestFn}>
          Login as Guest
        </Button>
        </>}
      </CardContent>
    </Card>
  )
}
