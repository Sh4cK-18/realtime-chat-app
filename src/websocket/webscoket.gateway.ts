import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*', // Allow all origins
  },
})


/**
 * WebsocketGateway handles WebSocket connections, disconnections, and messages.
 * It implements the OnGatewayConnection and OnGatewayDisconnect interfaces.
 */
export class WebsocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
    /**
     * The WebSocket server instance.
     */
    @WebSocketServer()
    server: Server;

    /**
     * A map to store connected users with their client IDs as keys and usernames as values.
     */
    private users = new Map<string, string>();

    /**
     * Handles a new client connection.
     * @param client - The connected client socket.
     */
    handleConnection(client: Socket) {
        console.log(`Client connected: ${client.id}`);
    }

    /**
     * Handles a client disconnection.
     * @param client - The disconnected client socket.
     */
    handleDisconnect(client: Socket) {
        console.log(`Client disconnected: ${client.id}`);
        this.users.delete(client.id);
        this.server.emit('users', Array.from(this.users.values()));
    }

    /**
     * Handles a client joining the chat.
     * @param client - The client socket.
     * @param username - The username of the client.
     * @returns The username of the client.
     */
    @SubscribeMessage('join')
    handleJoin(client: Socket, username: string): string {
        this.users.set(client.id, username);
        this.server.emit('users', Array.from(this.users.values()));
        console.log(`✅ Cliente ${client.id} unido como ${username}`);
        return username;
    }

    /**
     * Handles a message sent by a client.
     * @param client - The client socket.
     * @param message - The message object containing the sender and text.
     * @returns The message object.
     */
    @SubscribeMessage('message')
    handleMessage(client: Socket, message: { sender: string; text: string }) {
        console.log(`Mensaje recibido de ${this.users.get(client.id)}: ${JSON.stringify(message)}`);
        this.server.emit('message', message);
        return message;
    }
}
