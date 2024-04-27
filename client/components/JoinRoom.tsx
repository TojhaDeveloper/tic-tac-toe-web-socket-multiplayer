import { useContext, useState } from "react";
import styled from "styled-components";
import gameContext from "../gameContext";
import GameService from "../services/GameService";
import SocketService from "../services/SocketService";

interface IJoinRoomProps {}

const JoinRoomContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 2em;
`;
const RoomInput = styled.input`
  height: 30px;
  width: 20em;
  font-size: 17px;
  outline: none;
  border: 1px solid #8e44ad;
  padding: 0 10px;
  border-radius: 3px;
`;

const JoinButton = styled.button`
  font-size: 17px;
  color: #fff;
  outline: none;
  border: 2px solid transparent;
  background-color: #8e44ad;
  border-radius: 5px;
  padding: 4px 18px;
  margin-top: 1em;
  cursor: pointer;
  transition: all 230ms ease-in-out;
  &:hover {
    border: 2px solid #8e44ad;
    background-color: transparent;
    color: #8e44ad;
  }
`;

const JoinRoom = (props: IJoinRoomProps) => {
  const [roomName, setRoomName] = useState("");
  const [isJoining, setJoining] = useState(false);
  const { isInRoom, setInRoom } = useContext(gameContext);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setRoomName(value);
  };
  const joinRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    const socket = SocketService.socket;
    if (!socket || !roomName || roomName.trim() === "") return;
    setJoining(true);
    const joined = await GameService.joinRoom(socket, roomName).catch((err) => {
      alert(err);
    });
    if (joined) {
      setInRoom(true);
    }
    setJoining(false);
  };
  return (
    <form onSubmit={joinRoom}>
      <JoinRoomContainer>
        <h4>Enter Room ID to Join the Game</h4>
        <RoomInput
          placeholder="Room ID.."
          onChange={handleInputChange}
          value={roomName}
        />
        <JoinButton type="button" disabled={isJoining}>
          {isJoining ? "Joining..." : "Join"}
        </JoinButton>
      </JoinRoomContainer>
    </form>
  );
};

export default JoinRoom;
