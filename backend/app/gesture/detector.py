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

        print("Mencoba membuka kamera...")
        self.cap = cv2.VideoCapture(0)
        
        if not self.cap.isOpened():
            print("ERROR: Kamera tidak bisa dibuka. Coba:")
            print("1. Pastikan kamera tidak digunakan aplikasi lain")
            print("2. Coba ganti index kamera (0 -> 1 atau 2)")
            raise RuntimeError("Kamera tidak bisa dibuka")
        
        self.cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
        self.cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
        print("Kamera berhasil dibuka!")

        self.rules = GestureRules()

    def read(self):
        if not self.cap.isOpened():
            return None
            
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
