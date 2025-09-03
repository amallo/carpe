export interface SendMessageRequest {
    id: string;
    content: string;
    type: 'public';
    sentBy: string;
}
export interface MessageProvider {
    broadcastMessage(message: string): Promise<void>;
    send(message: SendMessageRequest): Promise<void>;
}