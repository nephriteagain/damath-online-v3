"use client"

import { Button } from "@/components/ui/button"
import GameTypeFilter from "@/components/GameTypeFilter"
import LobbyTable from "@/components/Lobby"
import Link from "next/link"

export default function WatchPage() {
    
    return (
        <main className="flex flex-col items-center justify-center h-screen">
            <div className="w-full flex flex-col gap-y-6 p-4 max-w-150 bg-secondary h-180 rounded-lg shadow-lg">
                <div className="flex flex-row justify-end items-center">
                    <GameTypeFilter />
                </div>
                <div className="flex flex-col flex-grow-1 bg-foreground justify-between pb-2 rounded-md shadow-md overflow-y-scroll">
                    <LobbyTable rooms={[]} />
                    <Link href={"/"} className="self-center">
                        <Button variant={"link"}>Back to Home</Button>
                    </Link>
                </div>
            </div>
        </main>
    )
}