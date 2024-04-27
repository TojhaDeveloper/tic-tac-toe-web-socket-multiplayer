import React from "react";

export type IMove = "x" | "o";
export interface IGameContextProps {
  isInRoom: boolean;
  setInRoom: (isInRoom: boolean) => void;
  setSymbol: (symbol: IMove) => void;
  symbol: IMove;
  isPlayerTurn: boolean;
  setTurn: (turn: boolean) => void;
  isGameStarted: boolean;
  setGameStarted: (isStarted: boolean) => void;
}

export interface IStartOptions {
  symbol: IMove;
  start: boolean;
}
const defaultState: IGameContextProps = {
  isInRoom: false,
  setInRoom: () => {},
  symbol: "x",
  setSymbol: () => {},
  isPlayerTurn: false,
  setTurn: () => {},
  isGameStarted: false,
  setGameStarted: () => {},
};
export default React.createContext(defaultState);
