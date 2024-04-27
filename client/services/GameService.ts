import { Socket } from "socket.io-client";
import { IMatrixProps } from "../components/Game";
import { IStartOptions } from "../gameContext";

class GameService {
  public async joinRoom(socket: Socket, roomId: string): Promise<boolean> {
    return new Promise((rs, rj) => {
      socket.emit("join_game", { roomId });
      socket.on("room_joined", () => rs(true));
      socket.on("join_room_error", ({ error }) => rj(error));
    });
  }

  public async updateGame(socket: Socket, gameMatrix: IMatrixProps) {
    socket.emit("update_game", { matrix: gameMatrix });
  }

  public async onGameUpdate(
    socket: Socket,
    listener: (matrix: IMatrixProps) => void
  ) {
    socket.on("on_update_game", ({ matrix }) => listener(matrix));
  }

  public async onGameStart(
    socket: Socket,
    listener: (options: IStartOptions) => void
  ) {
    socket.on("game_start", listener);
    socket.on("error", function (err) {
      console.error("Received a socket error:", err);
    });
  }

  public async winGame(socket: Socket, message: string) {
    socket.emit("win_game", { message });
  }
  public async onGameWin(socket: Socket, listener: (message: string) => void) {
    socket.on("on_win_game", ({ message }) => listener(message));
  }
}

export default new GameService();
