import { useState, useEffect } from "react";

export function useCameraPermission() {
  const [hasPermission, setHasPermission] = useState(null);
  const [isRequesting, setIsRequesting] = useState(false);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(() => {
        setHasPermission(true);
      })
      .catch(() => {
        setHasPermission(false);
      });
  }, []);

  const requestPermission = async () => {
    setIsRequesting(true);
    try {
      await navigator.mediaDevices.getUserMedia({ video: true });
      setHasPermission(true);
    } catch (error) {
      setHasPermission(false);
      console.error("Camera permission denied:", error);
    } finally {
      setIsRequesting(false);
    }
  };

  return { hasPermission, isRequesting, requestPermission };
}

