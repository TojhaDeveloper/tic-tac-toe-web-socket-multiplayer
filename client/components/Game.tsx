import { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import gameContext, { IMove, IStartOptions } from "../gameContext";
import GameService from "../services/GameService";
import SocketService from "../services/SocketService";

const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  font-family: "Zen Tokyo Zoo", cursive;
`;
const RowContainer = styled.div`
  display: flex;
  width: 100%;
`;

interface ICellProps {
  borderTop?: boolean;
  borderBottom?: boolean;
  borderLeft?: boolean;
  borderRight?: boolean;
}

const Cell = styled.div<ICellProps>`
  width: 13em;
  height: 9em;
  display: flex;
  border-radius: 20px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-top: ${({ borderTop }) => borderTop && "3px solid #8e44ad"};
  border-bottom: ${({ borderBottom }) => borderBottom && "3px solid #8e44ad"};
  border-left: ${({ borderLeft }) => borderLeft && "3px solid #8e44ad"};
  border-right: ${({ borderRight }) => borderRight && "3px solid #8e44ad"};
  transition: all 270ms ease-in-out;

  &:hover {
    background-color: #8d44ad28;
  }
`;
const PlayerStopper = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
  cursor: default;
  z-index: 99;
  bottom: 0;
  left: 0;
`;

const X = styled.span`
  font-size: 100px;
  color: #8e44ad;
  &::after {
    content: "X";
  }
`;
const O = styled.span`
  font-size: 100px;
  color: #8e44ad;
  &::after {
    content: "O";
  }
`;

export type IMatrixProps = Array<Array<IMove | null>>;
export const Game = () => {
  const [matrix, setMatrix] = useState<IMatrixProps>([
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ]);

  const {
    symbol,
    setSymbol,
    isPlayerTurn,
    setTurn,
    isGameStarted,
    setGameStarted,
  } = useContext(gameContext);

  const checkGame = (matrix: IMatrixProps) => {
    for (let i = 0; i < matrix.length; i++) {
      let row = [];
      for (let j = 0; j < matrix[0].length; j++) {
        row.push(matrix[i][j]);
      }
      if (row.every((v) => v && v === symbol)) {
        return [true, false];
      } else if (row.every((v) => v && v !== symbol)) {
        return [false, true];
      }
    }
    for (let i = 0; i < matrix.length; i++) {
      let column = [];
      for (let j = 0; j < matrix[0].length; j++) {
        column.push(matrix[j][i]);
      }
      if (column.every((v) => v && v === symbol)) {
        return [true, false];
      } else if (column.every((v) => v && v !== symbol)) {
        return [false, true];
      }
    }
    if (matrix[1][1]) {
      if (matrix[0][0] === matrix[1][1] && matrix[1][1] === matrix[2][2]) {
        if (matrix[1][1] === symbol) {
          return [true, false];
        } else {
          return [false, true];
        }
      }
      if (matrix[2][0] === matrix[1][1] && matrix[1][1] === matrix[0][2]) {
        if (matrix[1][1] === symbol) {
          return [true, false];
        } else {
          return [false, true];
        }
      }
    }
    //If its a Tie
    if (matrix.every((m) => m.every((n) => n !== null))) {
      return [true, true];
    }
    return [false, false];
  };

  const handleUserAction = (
    colId: number,
    rowId: number,
    symbol: "x" | "o"
  ) => {
    const newMatrix = matrix.map((innerArray) => [...innerArray]);
    if (newMatrix[rowId][colId] === null) {
      newMatrix[rowId][colId] = symbol;
      setMatrix(newMatrix);
    }
    if (SocketService.socket) {
      GameService.updateGame(SocketService.socket, newMatrix);
      const [currentPlayerWon, otherPlayerWon] = checkGame(newMatrix);
      if (currentPlayerWon && otherPlayerWon) {
        GameService.winGame(SocketService.socket, "The Game is a Tie!!");
        alert("The Game is a Tie!!");
      } else if (currentPlayerWon && !otherPlayerWon) {
        GameService.winGame(SocketService.socket, "You Lost!!");
        alert("You Won!!");
      }
      setTurn(false);
    }
  };

  const handleGameUpdate = () => {
    if (SocketService.socket) {
      GameService.onGameUpdate(SocketService.socket, (matrix) => {
        setMatrix(matrix);
        checkGame(matrix);
        setTurn(true);
      });
    }
  };

  const handleGameStart = () => {
    if (SocketService.socket) {
      GameService.onGameStart(SocketService.socket, (options) => {
        setGameStarted(true);
        setSymbol(options.symbol);
        if (options.start) {
          setTurn(true);
        } else {
          setTurn(false);
        }
      });
    }
  };

  const handleGameWin = () => {
    if (SocketService.socket) {
      GameService.onGameWin(SocketService.socket, (message) => {
        setTurn(false);
        alert(message);
      });
    }
  };

  useEffect(() => {
    handleGameUpdate();
    handleGameStart();
    handleGameWin();
  }, []);

  return (
    <GameContainer>
      {!isGameStarted && <h1>Waiting on another player to join the room</h1>}
      {(!isGameStarted || !isPlayerTurn) && <PlayerStopper />}
      {matrix.map((row, rowIdx) => {
        return (
          <RowContainer>
            {row.map((col, colId) => {
              return (
                <Cell
                  borderBottom={rowIdx < 2}
                  borderTop={rowIdx > 0}
                  borderLeft={colId > 0}
                  borderRight={colId < 2}
                  onClick={() => handleUserAction(colId, rowIdx, symbol)}
                >
                  {col !== null ? col === "x" ? <X /> : <O /> : null}
                </Cell>
              );
            })}
          </RowContainer>
        );
      })}
    </GameContainer>
  );
};
