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
    let connectionTimeout = null;

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
        if (state === WebSocket.CLOSED) {
          wsRef.current = null;
        }
      }

      try {
        ws = new WebSocket("ws://localhost:8765");
        wsRef.current = ws;

        connectionTimeout = setTimeout(() => {
          if (ws.readyState === WebSocket.CONNECTING) {
            console.warn("WebSocket connection timeout");
            ws.close();
          }
        }, 5000);

        ws.onopen = () => {
          if (connectionTimeout) {
            clearTimeout(connectionTimeout);
            connectionTimeout = null;
          }
          if (isMounted && shouldReconnect) {
            setConnected(true);
            console.log("WebSocket connected");
            if (reconnectTimeoutRef.current) {
              clearTimeout(reconnectTimeoutRef.current);
              reconnectTimeoutRef.current = null;
            }
          }
        };

        ws.onclose = (event) => {
          if (connectionTimeout) {
            clearTimeout(connectionTimeout);
            connectionTimeout = null;
          }
          if (isMounted && shouldReconnect) {
            setConnected(false);
            wsRef.current = null;
            console.log("WebSocket closed", event.code);
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

        ws.onerror = (error) => {
          if (connectionTimeout) {
            clearTimeout(connectionTimeout);
            connectionTimeout = null;
          }
          if (isMounted && shouldReconnect) {
            setConnected(false);
            console.error("WebSocket error:", error);
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
        if (connectionTimeout) {
          clearTimeout(connectionTimeout);
        }
        console.error("Error creating WebSocket:", error);
        if (isMounted && shouldReconnect) {
          setConnected(false);
        }
      }
    };

    const timeoutId = setTimeout(() => {
      connect();
    }, 100);

    return () => {
      shouldReconnect = false;
      isMounted = false;

      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      if (connectionTimeout) {
        clearTimeout(connectionTimeout);
      }

      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }

      if (sendControlTimeoutRef.current) {
        clearTimeout(sendControlTimeoutRef.current);
        sendControlTimeoutRef.current = null;
      }

      const currentWs = ws || wsRef.current;
      if (currentWs) {
        const state = currentWs.readyState;
        if (state === WebSocket.OPEN || state === WebSocket.CONNECTING) {
          currentWs.close(1000, "Component unmounting");
        }
        wsRef.current = null;
      }
    };
  }, []);

  const lastSentActionRef = useRef(null);
  const sendControlTimeoutRef = useRef(null);
  const actionCooldownRef = useRef({});

  const sendControl = (action) => {
    const ws = wsRef.current;
    if (ws?.readyState === WebSocket.OPEN) {
      const now = Date.now();
      const lastSent = actionCooldownRef.current[action] || 0;
      
      if (now - lastSent < 500) {
        return;
      }

      if (sendControlTimeoutRef.current) {
        clearTimeout(sendControlTimeoutRef.current);
      }

      sendControlTimeoutRef.current = setTimeout(() => {
        try {
          const message = JSON.stringify({ type: "CONTROL", action });
          ws.send(message);
          console.log(`Sent control: ${action}`);
          actionCooldownRef.current[action] = Date.now();
          lastSentActionRef.current = action;
        } catch (error) {
          console.error("Error sending control message:", error);
        }
      }, 100);
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
