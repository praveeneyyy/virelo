import { useEffect, useRef, useState, useCallback } from 'react';
import { DownloadJob } from '../types';

export interface WebSocketMessage {
  type: 'job_update' | string;
  job?: DownloadJob;
  data?: any;
}

export const useDownloadWebSocket = (onJobUpdate?: (job: DownloadJob) => void) => {
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<any>(null);

  const connect = useCallback(() => {
    try {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const host = window.location.host;
      const wsUrl = `${protocol}//${host}/ws/downloads`;

      const socket = new WebSocket(wsUrl);
      wsRef.current = socket;

      socket.onopen = () => {
        setIsConnected(true);
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
          reconnectTimeoutRef.current = null;
        }
      };

      socket.onmessage = (event) => {
        try {
          const payload: WebSocketMessage = JSON.parse(event.data);
          if (payload.type === 'job_update' && payload.job && onJobUpdate) {
            onJobUpdate(payload.job);
          }
        } catch (e) {
          // Non-json ping/pong
        }
      };

      socket.onclose = () => {
        setIsConnected(false);
        // Attempt reconnect in 3s
        reconnectTimeoutRef.current = setTimeout(() => {
          connect();
        }, 3000);
      };

      socket.onerror = () => {
        socket.close();
      };
    } catch (err) {
      setIsConnected(false);
    }
  }, [onJobUpdate]);

  useEffect(() => {
    connect();

    // Heartbeat keep-alive every 25 seconds
    const pingInterval = setInterval(() => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send('ping');
      }
    }, 25000);

    return () => {
      clearInterval(pingInterval);
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      if (wsRef.current) wsRef.current.close();
    };
  }, [connect]);

  return { isConnected };
};
