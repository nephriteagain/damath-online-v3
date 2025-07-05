import Button from "./Button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import { Room } from "@/types/lobby.types"
import { joinRoom } from "@/store/lobby/lobby.action"
import { useAsyncStatus } from "@/hooks/useAsyncStatus"
import { lobbySelector } from "@/store/lobby/lobby.store"

  export default function Lobby({rooms}: {rooms: Room[]}) {
    const [ joinRoomFn, isLoading ] = useAsyncStatus(joinRoom);
    const joinedRoom = lobbySelector.use.joinedRoom();



    return (
        <Table className="bg-foreground text-background rounded-md shadow-md">
            <TableHeader>
                <TableRow className="hover:bg-primary">
                <TableHead className="w-[100px] text-accent">Name</TableHead>
                <TableHead className="text-accent">Host</TableHead>
                <TableHead className="text-accent">Type</TableHead>
                <TableHead className="text-accent text-right">Action</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {
                    rooms.map(room => (
                        <TableRow className="hover:bg-primary" key={room.roomId}>
                            <TableCell className="font-medium max-w-50">
                                <p className="break-words whitespace-normal">
                                {room.name}
                                </p>
                            </TableCell>
                            <TableCell className="max-w-25">
                            <p className="break-words whitespace-normal">
                                {room.host}
                            </p>
                            </TableCell>
                            <TableCell className="max-w-25">
                                <p className="break-words whitespace-normal">
                                {room.gameType}
                                </p>
                                </TableCell>
                            <TableCell className="text-right">
                                <Button 
                                variant="secondary" 
                                disabled={!!room.guest || !!joinedRoom}
                                loading={isLoading}
                                onClick={() => joinRoomFn(room.roomId)}
                                >
                                {room.guest ? "Full" : "Join"}
                                </Button>
                            </TableCell>
                        </TableRow>

                    ))
                }
            </TableBody>
        </Table>
    )
  }