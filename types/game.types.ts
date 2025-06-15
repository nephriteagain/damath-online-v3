import { COLOR } from "@/lib/constants"

export type Coordinates = {
    x: number;
    y: number;
}

export type PieceType = {
    color: COLOR;
    value: string;
    pieceName: `${PieceType["color"]}|${PieceType["value"]}`;
    coordinates: Coordinates
}