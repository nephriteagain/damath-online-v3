"use client"
import { ReactNode } from "react";
import { lobbySelector } from "@/store/lobby/lobby.store";
import { useEffect } from "react";
import { ongoingGameChecker } from "@/store/game/game.action";
import { toast } from "sonner";
import { authSelector } from "@/store/auth/auth.store";
import { useRouter } from "next/navigation";

export default function ReconnectLayout({children}:{children: ReactNode}) {

    const user = authSelector.use.user();
    const router = useRouter()
    
    useEffect(() => {
        if (!user) {
            return;
        }

        const onChange = (change: string|null) => {
            const currentOngoingId = lobbySelector.getState().ongoingGameId
            if (!currentOngoingId) {
                lobbySelector.setState({
                    ongoingGameId: change
                })
            } 
            else if (currentOngoingId && change === null) {
                // will trigger when there is an ongoing game, that is gameOver
                toast("Player has left the game.", {
                    action: {
                        label: "Exit",
                        onClick: () => {
                            console.log("exit clicked.")
                            lobbySelector.setState({
                            ongoingGameId: null
                        })
                        router.push("/lobby")

                    },
                    },
                    duration: 10_000,

                })
            }
           
        }
        const unsub = ongoingGameChecker(onChange)

        return () => unsub();
    }, [user])

    return (
        <>
            {children}
        </>
    )
}