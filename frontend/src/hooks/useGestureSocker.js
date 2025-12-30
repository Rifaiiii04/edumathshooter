import { useEffect, useRef, useState } from "react";

export function useGestureSocket() {
  const wsRef = useRef(null);
  const [gesture, setGesture] = useState(null);
  const [connected, setConnected] = useState(false);
  const reconnectTimeoutRef = useRef(null);

  useEffect(() => {
    let ws = null;
    let isMounted = true;
    let shouldReconnect = true;

    const connect = () => {
      if (!isMounted || !shouldReconnect) return;

      const currentWs = wsRef.current;
      if (currentWs) {
        const state = currentWs.readyState;
        if (state === WebSocket.CONNECTING || state === WebSocket.OPEN) {
          return;
        }
        if (state === WebSocket.CLOSING) {
          return;
        }
      }

      try {
        ws = new WebSocket("ws://localhost:8765");
        wsRef.current = ws;

        ws.onopen = () => {
          if (isMounted && shouldReconnect) {
            setConnected(true);
            if (reconnectTimeoutRef.current) {
              clearTimeout(reconnectTimeoutRef.current);
              reconnectTimeoutRef.current = null;
            }
          }
        };

        ws.onclose = (event) => {
          if (isMounted && shouldReconnect) {
            setConnected(false);
            wsRef.current = null;
            if (event.code !== 1000 && !reconnectTimeoutRef.current) {
              reconnectTimeoutRef.current = setTimeout(() => {
                reconnectTimeoutRef.current = null;
                if (isMounted && shouldReconnect) {
                  connect();
                }
              }, 3000);
            }
          }
        };

        ws.onerror = () => {
          if (isMounted && shouldReconnect) {
            setConnected(false);
          }
        };

        ws.onmessage = (e) => {
          if (isMounted && shouldReconnect) {
            try {
              const data = JSON.parse(e.data);
              setGesture(data);
            } catch (error) {
              console.error("Error parsing WebSocket message:", error);
            }
          }
        };
      } catch (error) {
        console.error("Error creating WebSocket:", error);
        if (isMounted && shouldReconnect) {
          setConnected(false);
        }
      }
    };

    connect();

    return () => {
      shouldReconnect = false;
      isMounted = false;

      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }

      const currentWs = ws || wsRef.current;
      if (currentWs) {
        const state = currentWs.readyState;
        if (state !== WebSocket.CLOSED && state !== WebSocket.CLOSING) {
          currentWs.close(1000, "Component unmounting");
        }
        wsRef.current = null;
      }
    };
  }, []);

  const sendControl = (action) => {
    const ws = wsRef.current;
    if (ws?.readyState === WebSocket.OPEN) {
      try {
        const message = JSON.stringify({ type: "CONTROL", action });
        ws.send(message);
        console.log(`Sent control: ${action}`);
      } catch (error) {
        console.error("Error sending control message:", error);
      }
    } else {
      console.warn(
        `Cannot send ${action}: WebSocket not open (state: ${ws?.readyState})`
      );
    }
  };

  return {
    gesture,
    connected,
    start: () => sendControl("START"),
    pause: () => sendControl("PAUSE"),
  };
}
