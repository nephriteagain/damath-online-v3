"use client"

import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Room } from "./components/Room"

export default function LobbyPage() {
    const [room, setRoom] = useState<string|null>(null)
    
    return (
        <main className="flex flex-col items-center justify-center h-screen">
            <div className="w-full p-4 max-w-150 bg-secondary h-180 rounded-lg shadow-lg">
                <div>
                    {    room ?
                        <Room room={room} setRoom={setRoom} /> :
                        <Button onClick={() => setRoom(Math.random().toString(16).slice(2))}>Create Room</Button>
                    }
                </div>
            </div>
        </main>
    )
}