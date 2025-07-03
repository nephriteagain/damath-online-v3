export const RULES: string[] = [
    "Set the starting position of the chips.",

    "Toss a coin to determine which player will have the first ‘move’.",

    "Moving a chip means sliding it diagonally in the forward direction only except when taking an opponent's chip or if a 'dama’ chip takes an opponent's chip.",

    "The two players alternately take turns in moving a chip(a pass is not allowed). + A player who touches a chip {touch move’) is required to move unless it ts not possible to do so. After each ‘move’, a player has to record his or her ‘move’ in a scoresheet (only one scoresheet will be used by the two players).",

    // "Each player is allotted one minute per ‘move’ including the recording of the 'move’ and the corresponding score in the scoresheet. In as much as taking a chip or chips is mandatory, then the one-minute per ‘move’ does not apply in this situation. In taking an opponent's chip. the taker’ chip jumps over the ‘taken’ chip and uses any of the four operation symbols of +, -_ x, and -:- where the taker chip lands.",

    `A chip is declared ‘dama’ if’ it stops in any of the following squares of the opposing player: (1.0) (3.0) (5.0) (7.0) Similarly the opposing player's chip is declared 'dama’  if it stops in any of the following squares: (0.7) (2.7){4.7) (6.7) - A 'dama’ chip can slide diagonally forward or backward in any unoccupied square as long as no opponent's chip blocks its path. It could take a chip or chips whereby its corresponding sum. difference, product or quotient is doubled. Sunilarly if an ordinary chip takes an opponent's 'dama’ chip, its score is also doubled. Correspondingly, if a 'dama’ chip takes an opponent's ‘dama’ chip. then its score is quadrupled - A taker’ chip can take one chip or more than one chips with the required option to take the greater number of chips. - Between "a
  'dama’ chip taking an opponent's chip” and "a chip taking an opponent's chip”, the former prevails. - A taker’ or taken dama’ chip should be identified by encircling it in the scoresheet.`,

    "The game ends if the 20-minute game period lapsed: - the moves are repetitive: © a player has no more chips to move: - an opponent's chip is ‘cornered’",

    "The remaining chip or chips of the players are to be added to their respective scores. If the remaining chip is a 'dama’. then its score is also doubled.",

    "The player with the greater accumulated total score wins the game.",
];

export const ABOUT = `Damath is a two-player educational board game combining the board game "Dama" (Filipino checkers) and math. It is used as a teaching tool for both elementary and high school mathematics. Every piece has a corresponding number and each even (white) square on board has a mathematical symbol. The game is commonly played in all elementary and secondary schools in the Philippines. In 2017, some developments in the game was proposed by Vincent Isidro to accommodate the needs of students who have special needs. The proposed inclusive version of the game rules was evaluated by a panel consisting of popular and respected Damath players such as Richard Rusczyk, Acey Edward Eli, Jocelyn Marie Gahol, Camila Villena, Ma. Teresa Duran and headed by Lucienne Marie Andres.`;

export const HISTORY = `Damath was invented by Jesus Huenda, a teacher in the province of Sorsogon, Philippines, who had encountered problems in teaching math using traditional teaching methods. Inspired in part by an investigatory project called “Dama de Numero” submitted by a student (Emilio Hina Jr.) in 1975, Huenda overhauled the game and introduced it to his class, who enjoyed playing. Damath became popular and in 1980, the first Damath tournament was held in Sorsogon. The next year, Huenda received a gold medallion from the late President Ferdinand Marcos for his contributions in the field of teaching mathematics. The game reached its peak popularity in the 1990s, when it made the rounds of several mathematics education conventions all over the world such as the 10th Conference of the Mathematical Association of Western Australia (MAWA), the UNESCO-ICT4E conference in Thailand, the SEAMEO RECSAM/SEAMEC conference in Malaysia, and the APEC Learning Community Builders (ALCoB) conference in Korea. Damath was first introduced to the United States of America by an international Filipino educator, Reynaldo L. Duran at the National Council of Teachers of Mathematics (NCTM) Conference in New Mexico, USA in 2011.`;

export const BOARD_AND_PIECES = `The board is similar to a checkerboard but with a twist. All even (white) tiles on the board have a mathematical symbol which dictates the operation that will be used when a player's piece captures the opponent's piece. It has numbers labeled 0-7 on its sides to determine the coordinates of the piece. Each piece of the player has corresponding values depending on what type of damath is being played. Both board and damath pieces are mostly made of thick cardboard or illustration board.`;

export const GAMEPLAY = `The rules are similar to checkers but there are some differences:`;

export const GAMEPLAY_LIST = [
    "The goal is to have the most points at the end of the game.",
    "Points are scored for each capture made during play and for each piece still on the board at the end of the game.",
    "The games ends if a player has no pieces remaining (or cannot make a legal move), the moves are repetitive, or the twenty-minute time limit is reached.",
];

export const POINTS = `Points are scored as follows`;

export const POINTS_LIST = [
    "Each piece is assigned a value (printed on the piece)",
    "When a capture is made, the score of the capture is calculated by using the mathematical operation shown on the space the capturing piece lands on, with the values of the capturing piece and the captured piece as the operands.",
    "When a dama piece (king) captures or is captured, the score is doubled (or quadrupled when a dama piece captures a dama piece).",
    "Each player also scores the value of their pieces remaining on the board at the end of the game, with dama pieces again scoring double.",
];

export const ADDITIONAL =
    "Each player also scores the value of their pieces remaining on the board at the end of the game, with dama pieces again scoring double.";
