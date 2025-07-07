"use client"
import { auth } from "@/lib/firebase"
import { authSelector } from "@/store/auth/auth.store"
import { onAuthStateChanged } from "firebase/auth"
import { usePathname, useRouter } from "next/navigation"
import { ReactNode, useEffect } from "react"

export default function AuthLayout({children}:{children: ReactNode}) {

    const path = usePathname()
    const router = useRouter()

    

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log("logged in successfully")
                console.log(user)
                authSelector.setState({
                    user,
                })
            } else {
                console.log("user logged out")
            }
            if (user && path === "/auth") {
                router.replace("/")
            }
            if (!user) {
                authSelector.setState({
                    user: null,
                })
            }
        })
        return () => unsub()
    }, [])
    

    return (
        <>
            {children}
        </>
    )
}