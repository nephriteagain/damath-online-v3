
import { SVGLoader } from 'three/addons/loaders/SVGLoader.js';

export const loader = new SVGLoader()

export enum OPERATION {
  ADD = "ADD",
  SUBTRACT = "SUBTRACT",
  MULTIPLY = "MULTIPLY",
  DIVIDE = "DIVIDE",
}

/** left to right from 0-7 to 7-0  */
export const BOARD_OPERATIONS: (OPERATION | null)[] = [

  OPERATION.MULTIPLY, null,    OPERATION.DIVIDE, null, OPERATION.SUBTRACT, null,   OPERATION.ADD, null,

  null, OPERATION.DIVIDE, null, OPERATION.MULTIPLY, null,      OPERATION.ADD, null, OPERATION.SUBTRACT,

  OPERATION.SUBTRACT, null, OPERATION.ADD, null,      OPERATION.MULTIPLY, null, OPERATION.DIVIDE, null,

  null, OPERATION.ADD, null,   OPERATION.SUBTRACT, null, OPERATION.DIVIDE, null,   OPERATION.MULTIPLY,

  OPERATION.MULTIPLY, null,      OPERATION.DIVIDE, null, OPERATION.SUBTRACT, null,      OPERATION.ADD, null,

  null, OPERATION.DIVIDE, null,      OPERATION.MULTIPLY, null, OPERATION.ADD, null,   OPERATION.SUBTRACT,

  OPERATION.SUBTRACT, null,   OPERATION.ADD, null, OPERATION.MULTIPLY, null,      OPERATION.DIVIDE, null,

  null, OPERATION.ADD, null,   OPERATION.SUBTRACT, null, OPERATION.DIVIDE, null,      OPERATION.MULTIPLY,

];

export const BOXES : {x: number, y: number, color: "DARK"|"LIGHT"; operation: OPERATION|null; }[] = [];

let i = 0;

for (let row = 0; row < 8; row++) {
  for (let col = 0; col < 8; col++) {
    const x = -3.5 + col;
    const y = 3.5 - row;
    const isLight = (row + col) % 2 === 0;
    BOXES.push({
      x,
      y,
      color: isLight ? "LIGHT" : "DARK",
      operation: BOARD_OPERATIONS[i]
    });
    ++i;
  }
}

export const COORDINATES_TO_POSITION = [
  // y = 7 (top row)
  { coordinates: { x: 0, y: 7 }, position: [-3.5, 3.5, 0.55] },
  { coordinates: { x: 1, y: 7 }, position: [-2.5, 3.5, 0.55] },
  { coordinates: { x: 2, y: 7 }, position: [-1.5, 3.5, 0.55] },
  { coordinates: { x: 3, y: 7 }, position: [-0.5, 3.5, 0.55] },
  { coordinates: { x: 4, y: 7 }, position: [0.5, 3.5, 0.55] },
  { coordinates: { x: 5, y: 7 }, position: [1.5, 3.5, 0.55] },
  { coordinates: { x: 6, y: 7 }, position: [2.5, 3.5, 0.55] },
  { coordinates: { x: 7, y: 7 }, position: [3.5, 3.5, 0.55] },

  // y = 6
  { coordinates: { x: 0, y: 6 }, position: [-3.5, 2.5, 0.55] },
  { coordinates: { x: 1, y: 6 }, position: [-2.5, 2.5, 0.55] },
  { coordinates: { x: 2, y: 6 }, position: [-1.5, 2.5, 0.55] },
  { coordinates: { x: 3, y: 6 }, position: [-0.5, 2.5, 0.55] },
  { coordinates: { x: 4, y: 6 }, position: [0.5, 2.5, 0.55] },
  { coordinates: { x: 5, y: 6 }, position: [1.5, 2.5, 0.55] },
  { coordinates: { x: 6, y: 6 }, position: [2.5, 2.5, 0.55] },
  { coordinates: { x: 7, y: 6 }, position: [3.5, 2.5, 0.55] },

  // y = 5
  { coordinates: { x: 0, y: 5 }, position: [-3.5, 1.5, 0.55] },
  { coordinates: { x: 1, y: 5 }, position: [-2.5, 1.5, 0.55] },
  { coordinates: { x: 2, y: 5 }, position: [-1.5, 1.5, 0.55] },
  { coordinates: { x: 3, y: 5 }, position: [-0.5, 1.5, 0.55] },
  { coordinates: { x: 4, y: 5 }, position: [0.5, 1.5, 0.55] },
  { coordinates: { x: 5, y: 5 }, position: [1.5, 1.5, 0.55] },
  { coordinates: { x: 6, y: 5 }, position: [2.5, 1.5, 0.55] },
  { coordinates: { x: 7, y: 5 }, position: [3.5, 1.5, 0.55] },

  // y = 4
  { coordinates: { x: 0, y: 4 }, position: [-3.5, 0.5, 0.55] },
  { coordinates: { x: 1, y: 4 }, position: [-2.5, 0.5, 0.55] },
  { coordinates: { x: 2, y: 4 }, position: [-1.5, 0.5, 0.55] },
  { coordinates: { x: 3, y: 4 }, position: [-0.5, 0.5, 0.55] },
  { coordinates: { x: 4, y: 4 }, position: [0.5, 0.5, 0.55] },
  { coordinates: { x: 5, y: 4 }, position: [1.5, 0.5, 0.55] },
  { coordinates: { x: 6, y: 4 }, position: [2.5, 0.5, 0.55] },
  { coordinates: { x: 7, y: 4 }, position: [3.5, 0.5, 0.55] },

  // y = 3
  { coordinates: { x: 0, y: 3 }, position: [-3.5, -0.5, 0.55] },
  { coordinates: { x: 1, y: 3 }, position: [-2.5, -0.5, 0.55] },
  { coordinates: { x: 2, y: 3 }, position: [-1.5, -0.5, 0.55] },
  { coordinates: { x: 3, y: 3 }, position: [-0.5, -0.5, 0.55] },
  { coordinates: { x: 4, y: 3 }, position: [0.5, -0.5, 0.55] },
  { coordinates: { x: 5, y: 3 }, position: [1.5, -0.5, 0.55] },
  { coordinates: { x: 6, y: 3 }, position: [2.5, -0.5, 0.55] },
  { coordinates: { x: 7, y: 3 }, position: [3.5, -0.5, 0.55] },

  // y = 2
  { coordinates: { x: 0, y: 2 }, position: [-3.5, -1.5, 0.55] },
  { coordinates: { x: 1, y: 2 }, position: [-2.5, -1.5, 0.55] },
  { coordinates: { x: 2, y: 2 }, position: [-1.5, -1.5, 0.55] },
  { coordinates: { x: 3, y: 2 }, position: [-0.5, -1.5, 0.55] },
  { coordinates: { x: 4, y: 2 }, position: [0.5, -1.5, 0.55] },
  { coordinates: { x: 5, y: 2 }, position: [1.5, -1.5, 0.55] },
  { coordinates: { x: 6, y: 2 }, position: [2.5, -1.5, 0.55] },
  { coordinates: { x: 7, y: 2 }, position: [3.5, -1.5, 0.55] },

  // y = 1
  { coordinates: { x: 0, y: 1 }, position: [-3.5, -2.5, 0.55] },
  { coordinates: { x: 1, y: 1 }, position: [-2.5, -2.5, 0.55] },
  { coordinates: { x: 2, y: 1 }, position: [-1.5, -2.5, 0.55] },
  { coordinates: { x: 3, y: 1 }, position: [-0.5, -2.5, 0.55] },
  { coordinates: { x: 4, y: 1 }, position: [0.5, -2.5, 0.55] },
  { coordinates: { x: 5, y: 1 }, position: [1.5, -2.5, 0.55] },
  { coordinates: { x: 6, y: 1 }, position: [2.5, -2.5, 0.55] },
  { coordinates: { x: 7, y: 1 }, position: [3.5, -2.5, 0.55] },

  // y = 0 (bottom row)
  { coordinates: { x: 0, y: 0 }, position: [-3.5, -3.5, 0.55] },
  { coordinates: { x: 1, y: 0 }, position: [-2.5, -3.5, 0.55] },
  { coordinates: { x: 2, y: 0 }, position: [-1.5, -3.5, 0.55] },
  { coordinates: { x: 3, y: 0 }, position: [-0.5, -3.5, 0.55] },
  { coordinates: { x: 4, y: 0 }, position: [0.5, -3.5, 0.55] },
  { coordinates: { x: 5, y: 0 }, position: [1.5, -3.5, 0.55] },
  { coordinates: { x: 6, y: 0 }, position: [2.5, -3.5, 0.55] },
  { coordinates: { x: 7, y: 0 }, position: [3.5, -3.5, 0.55] },
] as const;

export enum COLOR {
  RED = "RED",
  BLUE = "BLUE"
}

export const INITIAL_PIECE_POSITIONS = [
  // FOR RED
  {x: 1, y: 2, color: COLOR.RED},
  {x: 3, y: 2, color: COLOR.RED},
  {x: 5, y: 2, color: COLOR.RED},
  {x: 7, y: 2, color: COLOR.RED},

  {x: 0, y: 1, color: COLOR.RED},
  {x: 2, y: 1, color: COLOR.RED},
  {x: 4, y: 1, color: COLOR.RED},
  {x: 6, y: 1, color: COLOR.RED},

  {x: 1, y: 0, color: COLOR.RED},
  {x: 3, y: 0, color: COLOR.RED},
  {x: 5, y: 0, color: COLOR.RED},
  {x: 7, y: 0, color: COLOR.RED},

  // FOR BLUE,
  {x: 6, y: 5, color: COLOR.BLUE},
  {x: 4, y: 5, color: COLOR.BLUE},
  {x: 2, y: 5, color: COLOR.BLUE},
  {x: 0, y: 5, color: COLOR.BLUE},

  {x: 7, y: 6, color: COLOR.BLUE},
  {x: 5, y: 6, color: COLOR.BLUE},
  {x: 3, y: 6, color: COLOR.BLUE},
  {x: 1, y: 6, color: COLOR.BLUE},

  {x: 6, y: 7, color: COLOR.BLUE},
  {x: 4, y: 7, color: COLOR.BLUE},
  {x: 2, y: 7, color: COLOR.BLUE},
  {x: 0, y: 7, color: COLOR.BLUE},
]

export const COUNTING_PIECES = [
  "10",
  "7",
  "2",
  "5",
  "1",
  "4",
  "11",
  "8",
  "12",
  "9",
  "6",
  "3",
  "10",
  "7",
  "2",
  "5",
  "1",
  "4",
  "11",
  "8",
  "12",
  "9",
  "6",
  "3"
]

export const RED_KING_COORDINATES = [
  {x: 0, y: 7},
  {x: 2, y: 7},
  {x: 4, y: 7},
  {x: 6, y: 7},
]
export const BLUE_KING_COORDINATES = [
  {x: 1, y: 0},
  {x: 3, y: 0},
  {x: 5, y: 0},
  {x: 7, y: 0},
]

export enum GAME_TYPE {
  "COUNTING",
  "WHOLE",
  "INTEGER",
  "FRACTION",
  "RATIONAL",
  "RADICAL"
}

export const operationToSymbol = {
  [OPERATION.ADD]: "+",
  [OPERATION.SUBTRACT]: "-",
  [OPERATION.MULTIPLY]: "*",
  [OPERATION.DIVIDE]: "/",
}
