import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import {
    ABOUT,
    HISTORY,
    BOARD_AND_PIECES,
    GAMEPLAY,
    GAMEPLAY_LIST,
    POINTS,
    POINTS_LIST,
    ADDITIONAL,
} from "@/lib/rules";
import { BsInfoCircle } from "react-icons/bs";

export default function About() {
    return (
        <Dialog>
            <DialogTrigger className="w-full flex flex-row gap-2  items-center justify-center px-3 text-2xl bg-primary max-w-[200px] py-1 text-md text-white shadow-sm drop-shadow-md hover:scale-105 active:scale-95 transition-all duration-150 rounded-md hover:bg-secondary">
                <p>About</p>
                <BsInfoCircle />
            </DialogTrigger>
            <DialogContent className="rule-popup h-[80%] max-h-[500px] overflow-y-scroll">
                <DialogHeader>
                    <DialogTitle>About Damath</DialogTitle>
                    <DialogDescription className="indent-6 text-justify">
                        {ABOUT}
                    </DialogDescription>
                    <DialogTitle>History</DialogTitle>
                    <DialogDescription className="indent-6 text-justify">
                        {HISTORY}
                    </DialogDescription>
                    <DialogTitle>Board and Pieces</DialogTitle>
                    <DialogDescription className="indent-6 text-justify">
                        {BOARD_AND_PIECES}
                    </DialogDescription>
                    <DialogTitle>{GAMEPLAY}</DialogTitle>
                    <DialogDescription>
                        {GAMEPLAY_LIST.map((list, i) => {
                            return (
                                <li key={i} className="ms-6">
                                    {list}
                                </li>
                            );
                        })}
                    </DialogDescription>
                    <DialogTitle>{POINTS}</DialogTitle>
                    <DialogDescription>
                        {POINTS_LIST.map((list, i) => {
                            return (
                                <li key={i} className="ms-6">
                                    {list}
                                </li>
                            );
                        })}
                    </DialogDescription>
                    <DialogDescription>{ADDITIONAL}</DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}
