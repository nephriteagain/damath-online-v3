import { Coordinates, PieceType, DIRECTION } from "@/types/game.types";
import { COLOR } from "./constants";

export class BoxNode {
    public coordinates: Coordinates
    public tr?: BoxNode|null;
    public tl?: BoxNode|null;
    public br?: BoxNode|null;
    public bl?: BoxNode|null;
    public piece: PieceType|null
  
    constructor(coordinates: Coordinates, piece: PieceType|null) {
      this.coordinates = coordinates
      this.piece = piece
    }

    /* this functions setups the box connections */
    addConnection(boxNode: BoxNode, location: "tr" | "tl" | "br" | "bl") {
        this[location] = boxNode
    }

    private checkMove(box: BoxNode|null, moves: Coordinates[]) {
      if (!box || box.piece) {
        return;
      }
      moves.push(box.coordinates)
    }

    private checkMoveRecursive(box: BoxNode | null,moves: Coordinates[], direction: DIRECTION) {
      // terminate recursion
      if (!box || box.piece) {
        return;
      }
      moves.push(box.coordinates)

      if (direction === DIRECTION.BL) {
        this.checkMoveRecursive(this.bl ?? null, moves, direction)
      }
      if (direction === DIRECTION.BR) {
        this.checkMoveRecursive(this.bl ?? null, moves, direction)
      }
      if (direction === DIRECTION.TL) {
        this.checkMoveRecursive(this.bl ?? null, moves, direction)
      }
      if (direction === DIRECTION.TR) {
        this.checkMoveRecursive(this.bl ?? null, moves, direction)
      }
    }

    checkAvailableMoves() {
      const moves : Coordinates[] = []
      const currentPiece = this.piece;
      if (!currentPiece) {
        throw new Error("no current piece to move")
      }
      // for normal pieces
      if (!currentPiece.isKing) {

        if (currentPiece.color === COLOR.RED) {
          this.checkMove(this.tl ?? null, moves)
          this.checkMove(this.tr ?? null, moves)
        }

        if (currentPiece.color === COLOR.RED) {
          this.checkMove(this.bl ?? null, moves)
          this.checkMove(this.br ?? null, moves)
        }
      } else {
        // for king pieces
        this.checkMoveRecursive(this.bl ?? null, moves, DIRECTION.BL)
        this.checkMoveRecursive(this.br ?? null, moves, DIRECTION.BR)
        this.checkMoveRecursive(this.tl ?? null, moves, DIRECTION.TL)
        this.checkMoveRecursive(this.tr ?? null, moves, DIRECTION.TR)
      }
      return moves
    }

    checkAvailableJumps() {
      const jumps: {coordinates: Coordinates; pieceToCapture: PieceType}[] = []
      const currentPiece = this.piece;
      if (!currentPiece) {
        throw new Error("no current piece to jump")
      }
      if (!currentPiece.isKing) {

      } else {
        
      }
      return jumps
    }
  }
