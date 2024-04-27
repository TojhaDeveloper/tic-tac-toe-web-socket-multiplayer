import {
  ConnectedSocket,
  MessageBody,
  OnMessage,
  SocketController,
  SocketIO,
} from "socket-controllers";
import { Server, Socket } from "socket.io";

@SocketController()
export class RoomController {
  @OnMessage("join_game")
  public async joinGame(
    @SocketIO() io: Server,
    @ConnectedSocket() socket: Socket,
    @MessageBody() message: any
  ) {
    console.log("New User joining room: ", message);
    const connectedSockets = io.sockets.adapter.rooms.get(message.roomId);
    const socketRooms = Array.from(socket.rooms.values()).filter(
      (r) => r !== socket.id
    );
    if (socketRooms.length > 0 || connectedSockets?.size === 2) {
      socket.emit("join_room_error", {
        error: "Room is full, please choose another room to play!",
      });
    } else {
      await socket.join(message.roomId);
      socket.emit("room_joined");
      if (io.sockets.adapter.rooms.get(message.roomId)?.size === 2) {
        console.log("🚀 ~ RoomController ~ message.roomId:", message.roomId);
        socket.emit("game_start", { symbol: "x", start: true });
        socket
          .to(message.roomId)
          .emit("game_start", { symbol: "o", start: false });
      }
    }
  }
}
