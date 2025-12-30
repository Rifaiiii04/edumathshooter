import cv2
import mediapipe as mp
from app.gesture.rules import GestureRules

mp_hands = mp.solutions.hands

class GestureDetector:
    def __init__(self):
        self.hands = mp_hands.Hands(
            static_image_mode=False,
            max_num_hands=1,
            min_detection_confidence=0.6,
            min_tracking_confidence=0.6
        )

        self.cap = cv2.VideoCapture(0)
        if not self.cap.isOpened():
            raise RuntimeError("Kamera tidak bisa dibuka")

        self.rules = GestureRules()

    def read(self):
        ret, frame = self.cap.read()
        if not ret:
            return None

        frame = cv2.flip(frame, 1)
        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        result = self.hands.process(rgb)

        data = {
            "x": None,
            "y": None,
            "armed": False,
            "shoot": False
        }

        if not result.multi_hand_landmarks:
            self.rules.reset()
            return data

        lm = result.multi_hand_landmarks[0].landmark

        # normalized cursor
        data["x"] = lm[8].x
        data["y"] = lm[8].y

        armed = self.rules.is_armed(lm)
        data["armed"] = armed

        if armed:
            data["shoot"] = self.rules.detect_shoot(lm)
        else:
            self.rules.reset()

        return data

    def release(self):
        self.cap.release()
