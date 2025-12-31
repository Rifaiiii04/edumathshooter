import cv2
import mediapipe as mp
from app.gesture.rules import GestureRules

mp_hands = mp.solutions.hands

class GestureDetector:
    def __init__(self):
        self.hands = mp_hands.Hands(
            static_image_mode=False,
            max_num_hands=1,
            min_detection_confidence=0.5,
            min_tracking_confidence=0.5,
            model_complexity=0
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
        self.cap.set(cv2.CAP_PROP_FPS, 30)
        print("Kamera berhasil dibuka!")

        self.rules = GestureRules()
        
        self.smooth_x = None
        self.smooth_y = None
        self.smoothing_factor = 0.6
        
        self.deadzone_threshold = 0.001
        
        self.last_valid_x = None
        self.last_valid_y = None
        self.last_valid_armed = False
        self.loss_frame_count = 0
        self.max_loss_frames = 5

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
            self.loss_frame_count += 1
            
            if self.loss_frame_count <= self.max_loss_frames and self.last_valid_x is not None:
                data["x"] = self.last_valid_x
                data["y"] = self.last_valid_y
                data["armed"] = self.last_valid_armed
                return data
            else:
                if self.loss_frame_count > self.max_loss_frames:
                    self.rules.reset()
                    self.smooth_x = None
                    self.smooth_y = None
                    self.last_valid_x = None
                    self.last_valid_y = None
                    self.last_valid_armed = False
                return data

        self.loss_frame_count = 0
        lm = result.multi_hand_landmarks[0].landmark

        raw_x = lm[8].x
        raw_y = lm[8].y

        if self.smooth_x is None or self.smooth_y is None:
            self.smooth_x = raw_x
            self.smooth_y = raw_y
        else:
            dx = raw_x - self.smooth_x
            dy = raw_y - self.smooth_y
            
            if abs(dx) > self.deadzone_threshold or abs(dy) > self.deadzone_threshold:
                self.smooth_x = self.smooth_x * (1 - self.smoothing_factor) + raw_x * self.smoothing_factor
                self.smooth_y = self.smooth_y * (1 - self.smoothing_factor) + raw_y * self.smoothing_factor

        data["x"] = self.smooth_x
        data["y"] = self.smooth_y

        armed = self.rules.is_armed(lm)
        data["armed"] = armed

        if armed:
            data["shoot"] = self.rules.detect_shoot(lm)
        else:
            self.rules.reset()

        self.last_valid_x = data["x"]
        self.last_valid_y = data["y"]
        self.last_valid_armed = data["armed"]

        return data

    def release(self):
        self.cap.release()
