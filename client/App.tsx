import { useEffect, useState } from "react";
import styled from "styled-components";
import JoinRoom from "./components/JoinRoom";
import socket from "./services/SocketService";
import GameContext, { IGameContextProps, IMove } from "./gameContext";
import { Game } from "./components/Game";
const AppContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 1em;
`;

const MainContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const WelcomeText = styled.h1`
  margin: 0;
  color: #8e44ad;
`;

const URL = "http://localhost:9000";
function App() {
  const [isInRoom, setInRoom] = useState(false);
  const [isPlayerTurn, setTurn] = useState(false);
  const [symbol, setSymbol] = useState<IMove>("x");
  const [isGameStarted, setGameStarted] = useState(false);
  const gameContext: IGameContextProps = {
    isInRoom,
    setInRoom,
    symbol,
    setSymbol,
    isPlayerTurn,
    setTurn,
    isGameStarted,
    setGameStarted,
  };
  const connectSocket = async () => {
    await socket.connect("http://localhost:9000");
  };

  useEffect(() => {
    connectSocket();
  }, []);
  return (
    <GameContext.Provider value={gameContext}>
      <AppContainer>
        <WelcomeText>Welcome to tic tac toe</WelcomeText>
        <MainContainer>
          {!isInRoom && <JoinRoom />}
          {isInRoom && <Game />}
        </MainContainer>
      </AppContainer>
    </GameContext.Provider>
  );
}

export default App;
