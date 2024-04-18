import { useState, useEffect } from "react";
import O from "./components/O";
import X from "./components/X";
import Cell from "./components/Cell";

const valuesComponents: ValuesComponents = {
  X: <X />,
  O: <O />,
};

interface ValuesComponents {
  X: JSX.Element;
  O: JSX.Element;
}

export default function App() {
  const [turn, setTurn] = useState<0 | 1>(0);
  const [board, setBoard] = useState<(keyof ValuesComponents | "")[][]>([
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ]);
  const [winningLine, setWinningLine] = useState<number[][] | null>(null);
  const [canClick, setCanClick] = useState<boolean>(true);

  const winCombos = [
    // Horizontales
    [[0, 0], [0, 1], [0, 2]],
    [[1, 0], [1, 1], [1, 2]],
    [[2, 0], [2, 1], [2, 2]],
  
    // Verticales
    [[0, 0], [1, 0], [2, 0]],
    [[0, 1], [1, 1], [2, 1]],
    [[0, 2], [1, 2], [2, 2]],
  
    // Diagonales
    [[0, 0], [1, 1], [2, 2]],
    [[0, 2], [1, 1], [2, 0]]
];


  useEffect(() => {
    if (turn === 1) {
      const [i, j] = findBestMove(board);
      setCanClick(false);
      setTimeout(() => {
        changeBoard(i, j);
        setCanClick(true);
      }, 300);
     
    }
  }, [board, turn]);

  

  useEffect(() => {
    const handleBoardClick = () => {
      if (winningLine) {
        resetGame();
      }
    };

    const boardElement = document.querySelector("#root");

    if (boardElement) {
      boardElement.addEventListener("click", handleBoardClick);
    }

    return () => {
      if (boardElement) {
        boardElement.removeEventListener("click", handleBoardClick);
      }
    };
  }, [winningLine]);

  const findBestMove = (currentBoard: (keyof ValuesComponents | "")[][]) => {
    let bestVal = -Infinity;
    let bestMove = [-1, -1];

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (currentBoard[i][j] === "") {
          currentBoard[i][j] = "O";
          const moveVal = minimax(currentBoard, 0, false);
          currentBoard[i][j] = "";
          if (moveVal > bestVal) {
            bestVal = moveVal;
            bestMove = [i, j];
          }
        }
      }
    }
    return bestMove;
  };

  const minimax = (currentBoard: (keyof ValuesComponents | "")[][], depth: number, isMaximizing: boolean) => {
    const result = checkWinner(currentBoard);
    if (result !== null) {
      return result === "O" ? 10 - depth : depth - 10;
    }

    if (isBoardFull(currentBoard)) {
      return 0;
    }

    if (isMaximizing) {
      let best = -Infinity;
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (currentBoard[i][j] === "") {
            currentBoard[i][j] = "O";
            best = Math.max(best, minimax(currentBoard, depth + 1, !isMaximizing));
            currentBoard[i][j] = "";
          }
        }
      }
      return best;
    } else {
      let best = Infinity;
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (currentBoard[i][j] === "") {
            currentBoard[i][j] = "X";
            best = Math.min(best, minimax(currentBoard, depth + 1, !isMaximizing));
            currentBoard[i][j] = "";
          }
        }
      }
      return best;
    }
  };

  const checkWinner = (currentBoard: (keyof ValuesComponents | "")[][]) => {
    for (const combo of winCombos) {
      const [a, b, c] = combo;
      const [x1, y1] = a;
      const [x2, y2] = b;
      const [x3, y3] = c;
      if (
        currentBoard[x1][y1] === currentBoard[x2][y2] &&
        currentBoard[x1][y1] === currentBoard[x3][y3] &&
        currentBoard[x1][y1] !== ""
      ) {
        return currentBoard[x1][y1];
      }
    }
    return null;
  };

  const isBoardFull = (currentBoard: (keyof ValuesComponents | "")[][]) => {
    return currentBoard.flat().every(item => item !== "");
  };

  const clickACell = (i: number, j: number) => {
    changeBoard(i, j);
  };

  const changeBoard = (i: number, j: number) => {
    if (winningLine !== null || board[i][j] !== "" || canClick === false) {
      return;
    }
  
    const updatedBoard = [...board];
    updatedBoard[i][j] = turn === 1 ? "O" : "X";
    setBoard(updatedBoard);
  
    const winner = checkWinner(updatedBoard);
    if (winner !== null) {
      const winningCombo = winCombos.find(combo => {
        return combo.every(cell => {
          const [x, y] = cell;
          return updatedBoard[x][y] === winner;
        });
      });
  
      winningCombo && setWinningLine(winningCombo);
    } else if (isBoardFull(updatedBoard)) {
      setWinningLine([[9, 9], [9, 9], [9, 9]]);
    } else {
      setTurn(turn === 1 ? 0 : 1);
    }
  };
  
  

  const resetGame = () => {
    setBoard([
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
    ]);
    setTurn(0);
    setWinningLine(null);
  };

  const generateCellClasses = (i: number, j: number) => {
    let classes = "";

    if (i === 1 && j === 1) {
      classes += "border-[14px] md:border-[20px] border-[#FFC0CB]";
    }
  
    if (j - 1 >= 0 && j + 1 < 3) {
      classes += "border-x-[14px] md:border-x-[20px] border-[#FFC0CB]";
    }
    
    if (i - 1 >= 0 && i + 1 < 3) {
      classes += "border-y-[14px] md:border-y-[20px] border-[#FFC0CB]";
    }
  
    return classes.length > 0 ? classes : "";
  };
  

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-purple-700">
      <div className="grid grid-cols-3 px-4">
        {board.map((row, i) =>
          row.map((value, j) => (
            <Cell
              key={`${i}-${j}`}
              value={value}
              classes={`${
                generateCellClasses(i, j)
              }`}
              i={i}
              j={j}
              clickACell={clickACell}
              winningLine={winningLine}
              valuesComponents={valuesComponents}
            />
          ))
        )}
      </div>
    </main>
  );
}
