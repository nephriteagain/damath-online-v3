import { LoaderCircle } from "lucide-react";
import { Button as ButtonUI } from "./ui/button";
import { ComponentProps } from "react";
import { cn } from "@/lib/utils";


export default function Button({disabled, loading, children, className, ...props}:ComponentProps<typeof ButtonUI> & {loading?: boolean}) {
    return (
        <ButtonUI disabled={disabled || loading} {...props} className={cn("relative", className)}>
            {children}
            { loading && <LoaderCircle className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-spin" />}
        </ButtonUI>
    )
}