import { Coordinates, PieceType, DIRECTION, Jump, Move } from "@/types/game.types";
import { COLOR,  OPERATION } from "./constants";

export class BoxNode {
    public coordinates: Coordinates
    public tr?: BoxNode|null;
    public tl?: BoxNode|null;
    public br?: BoxNode|null;
    public bl?: BoxNode|null;
    public piece: PieceType|null
    public operation: OPERATION|null;
  
    constructor(coordinates: Coordinates, piece: PieceType|null, operation: OPERATION|null) {
      this.coordinates = coordinates
      this.piece = piece
      this.operation = operation;
    }


    /* this functions setups the box connections */
    addConnection(boxNode: BoxNode, location: "tr" | "tl" | "br" | "bl") {
        this[location] = boxNode
    }

    /** piece a piece to this box */
    placePiece(piece:PieceType) {
      this.piece = piece
    }

    /** used for normal chips */
    private checkMove(box: BoxNode|null, moves: Move[], direction: DIRECTION) {
      if (!box || box.piece) {
        return;
      }
      if (!this.piece) throw new Error("pieceToMove not found")

      moves.push({
        coordinates: box.coordinates,
        pieceToMove: this.piece,
        direction
      })
    }

    /** use for king chips */
    private checkMoveRecursive(box: BoxNode | null,moves: Move[], direction: DIRECTION) {
      // terminate recursion
      if (!box || box.piece) {
        return;
      }
      if (!this.piece) throw new Error("pieceToMove not found")      

      moves.push({
        coordinates: box.coordinates,
        direction,
        pieceToMove: this.piece
      })

      const nextBox = box[direction]

      this.checkMoveRecursive(nextBox ?? null, moves, direction)

      // if (direction === DIRECTION.BL) {
      //   this.checkMoveRecursive(box.bl ?? null, moves, direction)
      // }
      // if (direction === DIRECTION.BR) {
      //   this.checkMoveRecursive(box.br ?? null, moves, direction)
      // }
      // if (direction === DIRECTION.TL) {
      //   this.checkMoveRecursive(box.tl ?? null, moves, direction)
      // }
      // if (direction === DIRECTION.TR) {
      //   this.checkMoveRecursive(box.tr ?? null, moves, direction)
      // }
    }

    checkAvailableMoves() {
      const moves : Move[] = []
      const currentPiece = this.piece;
      if (!currentPiece) {
        throw new Error("no current piece to move")
      }
      // for normal pieces
      if (!currentPiece.isKing) {

        if (currentPiece.color === COLOR.RED) {
          this.checkMove(this.tl ?? null, moves, DIRECTION.TL)
          this.checkMove(this.tr ?? null, moves, DIRECTION.TR)
        }

        if (currentPiece.color === COLOR.BLUE) {
          this.checkMove(this.bl ?? null, moves, DIRECTION.BL)
          this.checkMove(this.br ?? null, moves, DIRECTION.BR)
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

    

    private checkJumps(box: BoxNode|null, jumps: Jump[], direction: DIRECTION, visited = new Set<string>()) {
      if (!this.piece) {
        console.error("no piece found");
        return;
      }
      // no chip the capture or box piece is same color as jumping chip
      if (!box?.piece || box.piece?.color === this.piece.color) {
        return;
      }
    
      // save visited box
      const coordKey = `${box.coordinates.x},${box.coordinates.y}`;
      if (visited.has(coordKey)) return;
      visited.add(coordKey);
    
      // there is a opposite piece and  next box is empty
      const nextBox = box[direction];
      if (nextBox && !nextBox.piece) {
        // check for extra jump
        const extraJumps: Jump[] = [];
        const directions = [DIRECTION.BL, DIRECTION.BR, DIRECTION.TL, DIRECTION.TR]
        const oppositeDirection = {
          [DIRECTION.BL]: DIRECTION.TR,
          [DIRECTION.BR]: DIRECTION.TL,
          [DIRECTION.TL]: DIRECTION.BR,
          [DIRECTION.TR]: DIRECTION.BL,
        }
        // cannot jump again on the opposite direction they just jumped into
        for (const dir of directions.filter(d => d !== oppositeDirection[direction])) {
            this.checkJumps(nextBox[dir] ?? null, extraJumps, dir, new Set(visited));
        }
        // save jump
        const jump = {
          pieceToJump: this.piece,
          pieceToCapture: box.piece,
          coordinates: nextBox.coordinates,
          direction,
          extraJumps,
        };
        jumps.push(jump);
      }
    }
    

    private checkJumpsAsKing(initialBox: BoxNode, currentBox: BoxNode|null, jumpCoordinates: Jump[], pieceToCapture:PieceType|null, direction:DIRECTION, visited = new Set<string>()) {
      // react the edge of the box
      if (!currentBox) {
        console.log("edge")
        return;
      }

      // encountered a non empty box with same color piece
      if (currentBox.piece?.color === initialBox.piece?.color) {
        console.log("same color")
        return;
      }

      // save visited box
      const coordKey = `${currentBox.coordinates.x},${currentBox.coordinates.y}`;
      if (visited.has(coordKey)) return;
      visited.add(coordKey);

      const nextBox = currentBox[direction] ?? null

      // if encountered a empty box, with no pieceToCapture
      // continue looking
      if (!currentBox?.piece && !pieceToCapture) {
        this.checkJumpsAsKing(initialBox, nextBox, jumpCoordinates, null, direction, )
        console.log("empty box")
        return;
      }

      // encountered a piece to capture
      // for the first time
      if (initialBox.piece?.color !== currentBox.piece?.color && !pieceToCapture) {
        this.checkJumpsAsKing(initialBox, nextBox, jumpCoordinates, currentBox.piece, direction, )
        console.log("opponent piece found!")
        return;
      }


      // encountered a empty box after encountered a captureable piece
      if (!currentBox.piece && pieceToCapture) {
        // check for extra jump
        const extraJumps: Jump[] = [];
        const directions = [DIRECTION.BL, DIRECTION.BR, DIRECTION.TL, DIRECTION.TR]
        const oppositeDirection = {
          [DIRECTION.BL]: DIRECTION.TR,
          [DIRECTION.BR]: DIRECTION.TL,
          [DIRECTION.TL]: DIRECTION.BR,
          [DIRECTION.TR]: DIRECTION.BL,
        }
        // cannot jump again on the opposite direction they just jumped into
        for (const dir of directions.filter(d => d !== oppositeDirection[direction])) {
            this.checkJumpsAsKing(initialBox,  currentBox[dir] ?? null, extraJumps, null,  dir, new Set());
        }

        jumpCoordinates.push({
          coordinates: 
          currentBox.coordinates, 
          pieceToJump: initialBox.piece!,
          pieceToCapture, 
          direction,
          extraJumps
        })
        this.checkJumpsAsKing(initialBox, nextBox, jumpCoordinates, pieceToCapture, direction, )
        console.log("piece captured")
        return;
      }
      
    }

    private filterNestedJumps(jumps: Jump[]): Jump[] {
      // Helper: recursively calculate the max depth of a jump
      const getDepth = (jump: Jump): number => {
        if (!jump.extraJumps || jump.extraJumps.length === 0) return 1;
        return 1 + Math.max(...jump.extraJumps.map(getDepth));
      };
    
      // Step 1: Get depth for each jump
      const jumpsWithDepth = jumps.map(jump => ({
        jump,
        depth: getDepth(jump)
      }));
    
      // Step 2: Get max depth
      const maxDepth = Math.max(...jumpsWithDepth.map(j => j.depth));
    
      // Step 3: Filter by max depth and recursively filter extraJumps
      return jumpsWithDepth
        .filter(j => j.depth === maxDepth)
        .map(j => ({
          ...j.jump,
          extraJumps: j.jump.extraJumps
            ? this.filterNestedJumps(j.jump.extraJumps)
            : undefined
        }));
    }
    

    checkAvailableJumps() {
      const jumps: Jump[] = []
      const currentPiece = this.piece
      if (!currentPiece) {
        throw new Error("no current piece to jump")
      }
      // for normal piece
      if (!currentPiece.isKing) {
        console.log("NORMAL JUMP")
        // single jump
        this.checkJumps(this.tl ?? null, jumps, DIRECTION.TL)
        this.checkJumps(this.tr ?? null, jumps, DIRECTION.TR)
        this.checkJumps(this.bl ?? null, jumps, DIRECTION.BL)
        this.checkJumps(this.br ?? null, jumps, DIRECTION.BR)
      } else {
        console.log("KING JUMP")
        this.checkJumpsAsKing(this, this.tr ?? null, jumps, null, DIRECTION.TR)
        this.checkJumpsAsKing(this, this.tl ?? null, jumps, null, DIRECTION.TL)
        this.checkJumpsAsKing(this, this.br ?? null, jumps, null, DIRECTION.BR)
        this.checkJumpsAsKing(this, this.bl ?? null, jumps, null, DIRECTION.BL)
      }
      // we only focus on the jump that yield the most pieces
      const filteredJumps = this.filterNestedJumps(jumps)
      console.log(filteredJumps)
      return filteredJumps
    }
}

export class Board {
  public boxNodes : BoxNode[];

  constructor(pieces:PieceType[]) {
    
    // create the box nodes
    const b07 = new BoxNode({x:0, y: 7}, null, OPERATION.MULTIPLY)
    const b27 = new BoxNode({x:2, y: 7}, null, OPERATION.DIVIDE)
    const b47 = new BoxNode({x:4, y: 7}, null, OPERATION.SUBTRACT)
    const b67 = new BoxNode({x:6, y: 7}, null, OPERATION.ADD)

    const b16 = new BoxNode({x:1, y: 6}, null, OPERATION.DIVIDE)
    const b36 = new BoxNode({x:3, y: 6}, null, OPERATION.MULTIPLY)
    const b56 = new BoxNode({x:5, y: 6}, null, OPERATION.ADD)
    const b76 = new BoxNode({x:7, y: 6}, null, OPERATION.SUBTRACT)

    const b05 = new BoxNode({x:0, y: 5}, null, OPERATION.SUBTRACT)
    const b25 = new BoxNode({x:2, y: 5}, null, OPERATION.ADD)
    const b45 = new BoxNode({x:4, y: 5}, null, OPERATION.MULTIPLY)
    const b65 = new BoxNode({x:6, y: 5}, null, OPERATION.DIVIDE)

    const b14 = new BoxNode({x:1, y: 4}, null, OPERATION.ADD)
    const b34 = new BoxNode({x:3, y: 4}, null, OPERATION.SUBTRACT)
    const b54 = new BoxNode({x:5, y: 4}, null, OPERATION.DIVIDE)
    const b74 = new BoxNode({x:7, y: 4}, null, OPERATION.MULTIPLY)

    const b03 = new BoxNode({x:0, y: 3}, null, OPERATION.MULTIPLY)
    const b23 = new BoxNode({x:2, y: 3}, null, OPERATION.DIVIDE)
    const b43 = new BoxNode({x:4, y: 3}, null, OPERATION.SUBTRACT)
    const b63 = new BoxNode({x:6, y: 3}, null, OPERATION.ADD)

    const b12 = new BoxNode({x:1, y: 2}, null, OPERATION.DIVIDE)
    const b32 = new BoxNode({x:3, y: 2}, null, OPERATION.MULTIPLY)
    const b52 = new BoxNode({x:5, y: 2}, null, OPERATION.ADD)
    const b72 = new BoxNode({x:7, y: 2}, null, OPERATION.SUBTRACT)

    const b01 = new BoxNode({x:0, y: 1}, null, OPERATION.SUBTRACT)
    const b21 = new BoxNode({x:2, y: 1}, null, OPERATION.ADD)
    const b41 = new BoxNode({x:4, y: 1}, null, OPERATION.MULTIPLY)
    const b61 = new BoxNode({x:6, y: 1}, null, OPERATION.DIVIDE)

    const b10 = new BoxNode({x:1, y: 0}, null, OPERATION.ADD)
    const b30 = new BoxNode({x:3, y: 0}, null, OPERATION.SUBTRACT)
    const b50 = new BoxNode({x:5, y: 0}, null, OPERATION.DIVIDE)
    const b70 = new BoxNode({x:7, y: 0}, null, OPERATION.MULTIPLY)

    this.boxNodes = [
      b07,b27,b47,b67,

      b16,b36,b56,b76,

      b05,b25,b45,b65,

      b14,b34,b54,b74,

      b03,b23,b43,b63,

      b12,b32,b52,b72,

      b01,b21,b41,b61,

      b10,b30,b50,b70,
    ]

    // connect each nodes

    // Row 7
    // 0,7
    b07.addConnection(b16, "br")

    // 2,7
    b27.addConnection(b16, "bl")
    b27.addConnection(b36, "br")

    // 4,7
    b47.addConnection(b36, "bl")
    b47.addConnection(b56, "br")

    // 6,7
    b67.addConnection(b56, "bl")
    b67.addConnection(b76, "br")
    
    // Row 6
    // 1,6
    b16.addConnection(b07, "tl")
    b16.addConnection(b27, "tr")
    b16.addConnection(b05, "bl")
    b16.addConnection(b25, "br")

    // 3,6
    b36.addConnection(b27, "tl")
    b36.addConnection(b47, "tr")
    b36.addConnection(b25, 'bl')
    b36.addConnection(b45, 'br')

    // 5,6
    b56.addConnection(b47, "tl")
    b56.addConnection(b67, "tr")
    b56.addConnection(b45, 'bl')
    b56.addConnection(b65, 'br')

    // 7,6
    b76.addConnection(b67, "tl")
    b76.addConnection(b65, "bl")

    // Row 5
    // 0,5
    b05.addConnection(b16, "tr")
    b05.addConnection(b14, "br")

    // 2,5
    b25.addConnection(b16, "tl")
    b25.addConnection(b36, "tr")
    b25.addConnection(b14, "bl")
    b25.addConnection(b34, "br")

    // 4,5
    b45.addConnection(b36, "tl")
    b45.addConnection(b56, "tr")
    b45.addConnection(b34, "bl")
    b45.addConnection(b54, "br")

    // 6,5
    b65.addConnection(b56, "tl")
    b65.addConnection(b76, "tr")
    b65.addConnection(b54, "bl")
    b65.addConnection(b74, "br")

    // Row 4
    // 1,4
    b14.addConnection(b05, "tl")
    b14.addConnection(b25, "tr")
    b14.addConnection(b03, "bl")
    b14.addConnection(b23, "br")

    // 3,4
    b34.addConnection(b25, "tl")
    b34.addConnection(b45, "tr")
    b34.addConnection(b23, "bl")
    b34.addConnection(b43, "br")

    // 5,4
    b54.addConnection(b45, "tl")
    b54.addConnection(b65, "tr")
    b54.addConnection(b43, "bl")
    b54.addConnection(b63, "br")

    // 7,4
    b74.addConnection(b65, "tl")
    b74.addConnection(b63, "bl")

    // Row 3
    // 0,3
    b03.addConnection(b14, "tr")
    b03.addConnection(b12, "br")

    // 2,3
    b23.addConnection(b14, "tl")
    b23.addConnection(b34, "tr")
    b23.addConnection(b12, "bl")
    b23.addConnection(b32, "br")

    // 4,3
    b43.addConnection(b34, "tl")
    b43.addConnection(b54, "tr")
    b43.addConnection(b32, "bl")
    b43.addConnection(b52, "br")

    // 6,3
    b63.addConnection(b54, "tl")
    b63.addConnection(b74, "tr")
    b63.addConnection(b52, "bl")
    b63.addConnection(b72, "br")

    // Row 2
    // 1,2
    b12.addConnection(b03, "tl")
    b12.addConnection(b23, "tr")
    b12.addConnection(b01, "bl")
    b12.addConnection(b21, "br")

    // 3,2
    b32.addConnection(b23, "tl")
    b32.addConnection(b43, "tr")
    b32.addConnection(b21, "bl")
    b32.addConnection(b41, "br")

    // 5,2
    b52.addConnection(b43, "tl")
    b52.addConnection(b63, "tr")
    b52.addConnection(b41, "bl")
    b52.addConnection(b61, "br")

    // 7,2
    b72.addConnection(b63, "tl")
    b72.addConnection(b61, "bl")

    // Row 1
    // 0,1
    b01.addConnection(b12, "tr")
    b01.addConnection(b10, "br")

    // 2,1
    b21.addConnection(b12, "tl")
    b21.addConnection(b32, "tr")
    b21.addConnection(b10, "bl")
    b21.addConnection(b30, "br")

    // 4,1
    b41.addConnection(b32, "tl")
    b41.addConnection(b52, "tr")
    b41.addConnection(b30, "bl")
    b41.addConnection(b50, "br")

    // 6,1
    b61.addConnection(b52, "tl")
    b61.addConnection(b72, "tr")
    b61.addConnection(b50, "bl")
    b61.addConnection(b70, "br")

    // Row 0 (bottom row)
    // 1,0
    b10.addConnection(b01, "tl")
    b10.addConnection(b21, "tr")

    // 3,0
    b30.addConnection(b21, "tl")
    b30.addConnection(b41, "tr")

    // 5,0
    b50.addConnection(b41, "tl")
    b50.addConnection(b61, "tr")

    // 7,0
    b70.addConnection(b61, "tl")

    // add pieces to board
    for (const piece of pieces) {
      const boxNode = this.boxNodes.find(b => b.coordinates.x === piece.coordinates.x && b.coordinates.y === piece.coordinates.y)
      if (!boxNode) {
        throw new Error(`piece coordinate to box coordinate not found, ${piece.coordinates.x},${piece.coordinates.y}`)
      }
      boxNode.placePiece(piece)
    }
  }

  public getBoxNode(coordinates: Coordinates) {
    const box = this.boxNodes.find(b => b.coordinates.x === coordinates.x && b.coordinates.y === coordinates.y)
    if (!box) {
      throw new Error(`box coordinate not found, ${coordinates.x},${coordinates.y}`)
    }
    return box
  }

/**
 * Filters a matrix of jump paths to only include those that contain the deepest jump chains.
 * 
 * A "deep" jump is determined by the maximum depth of nested `extraJumps`.
 * Only jump paths that include at least one jump reaching that maximum depth are kept.
 * 
 * @param jumpsMatrix - A 2D array of Jump paths (each path is a sequence of chained jumps)
 * @returns A filtered 2D array of jump paths that contain the deepest jump(s)
 */
  public filterNestedJumpsMatrix(jumpsMatrix: Jump[][]): Jump[][] {
    // Helper: recursively calculate the max depth of a single jump
    const getDepth = (jump: Jump): number => {
      if (!jump.extraJumps || jump.extraJumps.length === 0) return 1;
      return 1 + Math.max(...jump.extraJumps.map(getDepth));
    };

    // Step 1: Map each jump in the matrix to its depth
    const jumpsDepths = jumpsMatrix.map(jumps => {
      return jumps.map(jump => ({
        jump,
        depth: getDepth(jump)
      }));
    });

    // Step 2: Find the maximum depth across the entire matrix
    const maxDepth = Math.max(
      ...jumpsDepths.flatMap(jumps => jumps.map(j => j.depth))
    );

    // Step 3: Keep only the jump paths (rows) that contain at least one jump with the max depth
    const deepestJumps = jumpsDepths.filter(jumps =>
      jumps.some(j => j.depth === maxDepth)
    );

    // Step 4: Strip off the depth metadata and return the raw Jump objects
    return deepestJumps.map(jumps => jumps.map(j => j.jump));
  }

  
}
