import { useEffect, useState, useCallback } from "react";

interface WebSocketMessage {
  type: "analytics-update" | "alert" | "ping" | "pong";
  data?: any;
  timestamp?: number;
}

interface UseRealtimeAnalyticsOptions {
  url?: string;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
}

export function useRealtimeAnalytics(options: UseRealtimeAnalyticsOptions = {}) {
  const {
    url = typeof window !== "undefined"
      ? `${window.location.protocol === "https:" ? "wss" : "ws"}://${window.location.host}/api/analytics/realtime`
      : "",
    reconnectInterval = 3000,
    maxReconnectAttempts = 5,
  } = options;

  const [connected, setConnected] = useState(false);
  const [data, setData] = useState<any>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [reconnectCount, setReconnectCount] = useState(0);

  const connect = useCallback(() => {
    if (!url || typeof window === "undefined") return;

    try {
      const ws = new WebSocket(url);

      ws.onopen = () => {
        console.log("[WebSocket] Connected to realtime analytics");
        setConnected(true);
        setReconnectCount(0);
        ws.send(JSON.stringify({ type: "ping" }));
      };

      ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);

          if (message.type === "analytics-update" && message.data) {
            setData(message.data);
            setLastUpdate(new Date());
          } else if (message.type === "ping") {
            ws.send(JSON.stringify({ type: "pong" }));
          }
        } catch (error) {
          console.error("[WebSocket] Failed to parse message:", error);
        }
      };

      ws.onerror = (error) => {
        console.error("[WebSocket] Error:", error);
        setConnected(false);
      };

      ws.onclose = () => {
        console.log("[WebSocket] Disconnected");
        setConnected(false);

        if (reconnectCount < maxReconnectAttempts) {
          setTimeout(() => {
            setReconnectCount((prev) => prev + 1);
            connect();
          }, reconnectInterval);
        }
      };

      return ws;
    } catch (error) {
      console.error("[WebSocket] Connection failed:", error);
      setConnected(false);
    }
  }, [url, reconnectCount, reconnectInterval, maxReconnectAttempts]);

  useEffect(() => {
    const ws = connect();
    return () => {
      ws?.close();
    };
  }, [connect]);

  return { connected, data, lastUpdate, reconnectCount };
}
