"use client";
import Link from "next/link";
import About from "@/components/About";
import RuleModal from "@/components/RuleModal";
import Local from "@/components/Local";
import Progress from "@/components/Progress";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { authSelector } from "@/store/auth/auth.store";
import UserMenu from "./components/UserMenu";

export default function HomePage() {
    const [start, setStart] = useState(false);
    const user = authSelector.use.user();

    return (
        <main className="flex min-h-screen flex-col items-center justify-center gap-6">
            <div className="absolute top-4 right-4 flex flex-row gap-x-4">
                {
                    user ?
                    <UserMenu displayName={user.displayName} uid={user.uid} isAnonymous={user.isAnonymous} /> :
                    <Link href={"/auth"}>
                    <Button>Sign In</Button>
                </Link>
                }
            
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold border-4 border-dashed p-4">
                <span className="me-4 text-red-800">Damath</span>
                <span className="text-blue-800">Online</span>
            </h1>
            <div className="w-[200px] flex flex-col items-center justify-center gap-4 p-2">
                <Link
                    href={"/lobby"}
                    className="w-full text-center bg-primary text-white text-2xl rounded-md shadow-lg drop-shadow-lg px-4 py-1 hover:scale-105 hover:bg-secondary hover:shadow-md hover:drop-shadow-md active:scale-100 transition-all duration-150"
                    onClick={() => setStart(true)}
                >
                    Lobbies
                </Link>
                <Local />
                <Link
                    href={"/watch"}
                    className="w-full text-center mb-4 bg-primary text-white text-2xl rounded-md shadow-lg drop-shadow-lg px-4 py-1 hover:scale-105 hover:bg-secondary hover:shadow-md hover:drop-shadow-md active:scale-100 transition-all duration-150"
                    onClick={() => setStart(true)}
                >
                    Watch
                </Link>

                <RuleModal />
                <About />
            </div>

            <Progress start={start} />
        </main>
    );
}
