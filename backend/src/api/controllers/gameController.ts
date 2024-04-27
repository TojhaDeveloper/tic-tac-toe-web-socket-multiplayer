import {
  ConnectedSocket,
  MessageBody,
  OnMessage,
  SocketController,
  SocketIO,
} from "socket-controllers";
import { Server, Socket } from "socket.io";

@SocketController()
export class GameController {
  private getSocketRoom(socket: Socket): string {
    const gameRooms = Array.from(socket.rooms.values()).filter(
      (r) => r !== socket.id
    );
    return gameRooms[0];
  }
  @OnMessage("update_game")
  public async joinGame(
    @SocketIO() io: Server,
    @ConnectedSocket() socket: Socket,
    @MessageBody() message: any
  ) {
    const gameRoom = this.getSocketRoom(socket);
    socket.to(gameRoom).emit("on_update_game", message);
  }
  @OnMessage("win_game")
  public async winGame(
    @SocketIO() io: Server,
    @ConnectedSocket() socket: Socket,
    @MessageBody() message: any
  ) {
    const gameRoom = this.getSocketRoom(socket);
    socket.to(gameRoom).emit("on_win_game", message);
  }
}
