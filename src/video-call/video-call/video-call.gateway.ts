// import {
//   SubscribeMessage,
//   WebSocketGateway,
//   WebSocketServer,
//   OnGatewayInit,
//   OnGatewayConnection,
//   OnGatewayDisconnect,
// } from '@nestjs/websockets';
// import { Server, Socket } from 'socket.io';

// @WebSocketGateway({ cors: true })
// export class VideoCallGateway
//   implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
// {
//   @WebSocketServer() server: Server;

//   afterInit() {
//     console.log('WebSocket Initialized');
//   }

//   handleConnection(client: Socket) {
//     console.log(`Client connected: ${client.id}`);
//   }

//   handleDisconnect(client: Socket) {
//     console.log(`Client disconnected: ${client.id}`);
//   }

//   @SubscribeMessage('join-room')
//   handleJoinRoom(client: Socket, room: string): void {
//     client.join(room);
//     client.to(room).emit('user-connected', client.id);
//   }

//   @SubscribeMessage('leave-room')
//   handleLeaveRoom(client: Socket, room: string): void {
//     client.leave(room);
//     client.to(room).emit('user-disconnected', client.id);
//   }

//   @SubscribeMessage('signal')
//   handleSignal(client: Socket, data: { room: string; signal: any }): void {
//     client.to(data.room).emit('signal', { id: client.id, signal: data.signal });
//   }
// }

// import {
//   SubscribeMessage,
//   WebSocketGateway,
//   WebSocketServer,
//   OnGatewayInit,
//   OnGatewayConnection,
//   OnGatewayDisconnect,
// } from '@nestjs/websockets';
// import { Server, Socket } from 'socket.io';

// @WebSocketGateway({ cors: true })
// export class VideoCallGateway
//   implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
// {
//   @WebSocketServer() server: Server;
//   private rooms: { [key: string]: string[] } = {}; // Armazena os IDs dos clientes por sala

//   afterInit() {
//     console.log('WebSocket Initialized');
//   }

//   handleConnection(client: Socket) {
//     console.log(`Client connected: ${client.id}`);
//   }

//   handleDisconnect(client: Socket) {
//     console.log(`Client disconnected: ${client.id}`);
//     // Remove o cliente da sala ao desconectar
//     for (const [room, clients] of Object.entries(this.rooms)) {
//       const index = clients.indexOf(client.id);
//       if (index !== -1) {
//         clients.splice(index, 1);
//         if (clients.length === 0) {
//           delete this.rooms[room];
//         } else {
//           this.server.to(room).emit('user-disconnected', client.id);
//         }
//         break;
//       }
//     }
//   }

//   @SubscribeMessage('join-room')
//   handleJoinRoom(client: Socket, room: string): void {
//     client.join(room);
//     if (!this.rooms[room]) {
//       this.rooms[room] = [];
//     }
//     this.rooms[room].push(client.id);
//     console.log(`Client ${client.id} joined room ${room}`);
//     client.to(room).emit('user-connected', client.id);
//   }

//   @SubscribeMessage('leave-room')
//   handleLeaveRoom(client: Socket, room: string): void {
//     client.leave(room);
//     const index = this.rooms[room]?.indexOf(client.id);
//     if (index !== -1) {
//       this.rooms[room].splice(index, 1);
//       if (this.rooms[room].length === 0) {
//         delete this.rooms[room];
//       }
//       console.log(`Client ${client.id} left room ${room}`);
//       client.to(room).emit('user-disconnected', client.id);
//     }
//   }

//   @SubscribeMessage('signal')
//   handleSignal(
//     client: Socket,
//     data: { room: string; signal: any; to: string },
//   ): void {
//     console.log(
//       `Signal received from client ${client.id} in room ${data.room}`,
//     );
//     if (data.to) {
//       // Envia notificação ao cliente de destino
//       this.server.to(data.to).emit('incoming-call', { from: client.id });
//       // Envia sinal para o cliente de destino
//       this.server
//         .to(data.to)
//         .emit('signal', { id: client.id, signal: data.signal });
//     }
//   }
// }

import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true })
export class VideoCallGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private rooms: { [key: string]: string[] } = {}; // Armazena os IDs dos clientes por sala

  afterInit() {
    console.log('WebSocket Initialized');
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    // Remove o cliente da sala ao desconectar
    for (const [room, clients] of Object.entries(this.rooms)) {
      const index = clients.indexOf(client.id);
      if (index !== -1) {
        clients.splice(index, 1);
        if (clients.length === 0) {
          delete this.rooms[room];
        } else {
          this.server.to(room).emit('user-disconnected', client.id);
        }
        break;
      }
    }
  }

  @SubscribeMessage('join-room')
  handleJoinRoom(client: Socket, room: string): void {
    client.join(room);
    if (!this.rooms[room]) {
      this.rooms[room] = [];
    }
    this.rooms[room].push(client.id);
    console.log(`Client ${client.id} joined room ${room}`);
    client.to(room).emit('user-connected', client.id);
  }

  @SubscribeMessage('leave-room')
  handleLeaveRoom(client: Socket, room: string): void {
    client.leave(room);
    const index = this.rooms[room]?.indexOf(client.id);
    if (index !== -1) {
      this.rooms[room].splice(index, 1);
      if (this.rooms[room].length === 0) {
        delete this.rooms[room];
      }
      console.log(`Client ${client.id} left room ${room}`);
      client.to(room).emit('user-disconnected', client.id);
    }
  }

  @SubscribeMessage('signal')
  handleSignal(
    client: Socket,
    data: { room: string; signal: any; to: string },
  ): void {
    console.log(
      `Signal received from client ${client.id} in room ${data.room}`,
    );
    if (data.to) {
      // Envia notificação ao cliente de destino
      this.server.to(data.to).emit('incoming-call', { from: client.id });
      // Envia sinal para o cliente de destino
      this.server
        .to(data.to)
        .emit('signal', { id: client.id, signal: data.signal });
    }
  }
}
