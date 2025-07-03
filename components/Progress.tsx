import { useState, useEffect } from "react";
import { Progress as ProgressUI } from "./ui/progress";

export default function Progress({ start }: { start: boolean }) {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (!start) return;
        const timer = setTimeout(() => setProgress(progress + 1), 2500);
        return () => clearTimeout(timer);
    }, [start, progress]);

    return (
        <div
            className={`${
                progress === 0 ? "invisible" : "visible"
            } absolute top-0 left-0 w-full`}
        >
            <ProgressUI
                color="red"
                value={progress}
                className="w-full rounded-none bg-transparent h-[6px]"
            />
        </div>
    );
}
