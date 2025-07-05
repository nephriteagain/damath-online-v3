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
import { GAME_TYPE_ARR } from "@/lib/constants"
import { capitalize } from "lodash"
import { ArrowDownAZ, ArrowDownZA } from "lucide-react"

export default function GameTypeFilter() {
  return (
    <div className="flex flex-row gap-x-4">
        <Select>
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
        <Select>
            <SelectTrigger className="w-22 bg-background">
                <SelectValue placeholder="Order" defaultValue={"ASC"} />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                <SelectLabel>Order</SelectLabel>
                    <SelectItem value="ASC">
                        <ArrowDownAZ />
                    </SelectItem>
                    <SelectItem value="DESC">
                        <ArrowDownZA />
                    </SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
    </div>
  )
}
