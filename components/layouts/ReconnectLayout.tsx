"use client"
import { ReactNode } from "react";
import { lobbySelector } from "@/store/lobby/lobby.store";
import { useEffect } from "react";
import { ongoingGameChecker } from "@/store/game/game.action";
import { toast } from "sonner";

export default function ReconnectLayout({children}:{children: ReactNode}) {

    useEffect(() => {
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
                    description: "Click here to go back to lobby.",
                    action: {
                        label: "Exit",
                        onClick: () => lobbySelector.setState({
                            ongoingGameId: null
                        }),
                    },
                    duration: Infinity,

                })
            }
           
        }
        const unsub = ongoingGameChecker(onChange)

        return () => unsub();
    }, [])

    return (
        <>
            {children}
        </>
    )
}