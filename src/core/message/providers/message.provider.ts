export interface SendMessageRequest {
    id: string;
    content: string;
    type: 'public';
    sentBy: string;
    sentAt: string;
}
export interface MessageProvider {
    send(message: SendMessageRequest): Promise<void>;
}