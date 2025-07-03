import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";

import { RULES } from "@/lib/rules";
import Link from "next/link";

export default function RuleModal() {
    return (
        <Dialog>
            <DialogTrigger className="w-full flex flex-row gap-2  items-center justify-center px-3 text-2xl bg-primary max-w-[200px] py-1 text-md text-white shadow-sm drop-shadow-md hover:scale-105 active:scale-95 transition-all duration-150 rounded-md hover:bg-secondary">
                <p>Rules</p>
            </DialogTrigger>
            <DialogContent className="rule-popup h-[80%] max-h-[500px] overflow-y-scroll">
                <DialogHeader>
                    <DialogTitle>Rules of Play</DialogTitle>
                    <DialogDescription className="mb-6">
                        {RULES.map((rule, index) => {
                            return (
                                <li key={index} className="mb-4 ms-6">
                                    {index + 1}. {rule}
                                </li>
                            );
                        })}
                    </DialogDescription>
                    <Button variant="link" className="italic">
                        <Link
                            href="https://depedbohol.org/v2/wp-content/uploads/2014/09/Rules-of-Damath.pdf"
                            target="_blank"
                            className="hover:scale-x-105 transition-all duration-150"
                        >
                            Rules was sourced here.
                        </Link>
                    </Button>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}
