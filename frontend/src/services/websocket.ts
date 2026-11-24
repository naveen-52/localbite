import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import type { AvailabilityEvent } from '../types';

export class AvailabilitySocketClient {
  private client: Client | null = null;
  private isConnected = false;

  public connect(shopId: number, onEvent: (event: AvailabilityEvent) => void, onError?: (err: any) => void) {
    const wsUrl = import.meta.env.VITE_WS_BASE_URL || 'http://localhost:8080/api/ws';

    this.client = new Client({
      webSocketFactory: () => new SockJS(wsUrl),
      reconnectDelay: 5000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      debug: (str) => {
        if (import.meta.env.DEV) {
          console.debug('[STOMP]:', str);
        }
      },
    });

    this.client.onConnect = () => {
      this.isConnected = true;
      const destination = `/topic/shop/${shopId}/availability`;

      this.client?.subscribe(destination, (message) => {
        try {
          const payload: AvailabilityEvent = JSON.parse(message.body);
          onEvent(payload);
        } catch (e) {
          console.error('Failed to parse WebSocket message body:', e);
        }
      });
    };

    this.client.onStompError = (frame) => {
      console.error('STOMP protocol error:', frame.headers['message']);
      if (onError) onError(frame);
    };

    this.client.activate();
  }

  public disconnect() {
    if (this.client && this.isConnected) {
      this.client.deactivate();
      this.isConnected = false;
    }
  }
}
