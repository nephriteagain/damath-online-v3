import * as React from "react"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { GAME_TYPE, GAME_TYPE_ARR, ORDER_BY } from "@/lib/constants"
import { capitalize } from "lodash"
import { ArrowDownAZ, ArrowDownZA } from "lucide-react"
import { lobbySelector } from "@/store/lobby/lobby.store"

export default function GameTypeFilter() {
    

  return (
    <div className="flex flex-row gap-x-4">
        <Select onValueChange={(v) => {
            if (v === "ALL") {
                lobbySelector.setState({gameTypeFilter: null})
            } else {
                lobbySelector.setState({gameTypeFilter: (v as GAME_TYPE)})
            }
            }}>
            <SelectTrigger className="w-28 bg-background">
                <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                <SelectLabel>Variations</SelectLabel>
                <SelectItem value="ALL">All</SelectItem>
                    {
                    GAME_TYPE_ARR.map(type => (
                        <SelectItem key={type} value={type}>{capitalize(type)}</SelectItem>
                        ))
                    }
                </SelectGroup>
            </SelectContent>
        </Select>
        <Select defaultValue={ORDER_BY.ASC} onValueChange={v => {
            lobbySelector.setState({lobbyOrder: v as ORDER_BY})
        }}>
            <SelectTrigger className="w-22 bg-background">
                <SelectValue placeholder="Order" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                <SelectLabel>Order</SelectLabel>
                    <SelectItem value={ORDER_BY.ASC}>
                        <ArrowDownAZ />
                    </SelectItem>
                    <SelectItem value={ORDER_BY.DESC}>
                        <ArrowDownZA />
                    </SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
    </div>
  )
}
