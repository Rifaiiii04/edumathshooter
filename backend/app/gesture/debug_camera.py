import cv2
from app.gesture.rules import GestureRules
from app.gesture.detector import GestureDetector

detector = GestureDetector()

print("DEBUG CAMERA MODE")
print("Tekan Q untuk keluar")

while True:
    data = detector.read()

    if data is None:
        print("Gagal baca frame")
        
        break

    print(data)

    ret, frame = detector.cap.read()
    if not ret:
        break

    frame = cv2.flip(frame, 1)

    if data["x"] is not None and data["y"] is not None:
        h, w, _ = frame.shape
        cx = int(data["x"] * w)
        cy = int(data["y"] * h)

        color = (150, 150, 150)
        if data["armed"]:
            color = (0, 255, 0)
        if data["shoot"]:
            color = (0, 0, 255)

        cv2.circle(frame, (cx, cy), 10, color, -1)
        cv2.line(frame, (cx - 15, cy), (cx + 15, cy), color, 2)
        cv2.line(frame, (cx, cy - 15), (cx, cy + 15), color, 2)

    cv2.imshow("Gesture Debug Camera", frame)

    if cv2.waitKey(1) & 0xFF == ord("q"):
        break

detector.release()
cv2.destroyAllWindows()
