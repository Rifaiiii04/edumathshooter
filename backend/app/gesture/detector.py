import cv2
import mediapipe as mp
import numpy as np
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
        
        self.cursor_x_ema = None
        self.cursor_y_ema = None
        self.ema_alpha = 0.7
        
        self.direction_vector_ema = None
        self.direction_alpha = 0.6
        
        self.deadzone_threshold = 0.001
        
        self.last_valid_x = None
        self.last_valid_y = None
        self.last_valid_armed = False
        self.loss_frame_count = 0
        self.max_loss_frames = 5

    def _compute_directional_cursor(self, lm, is_armed):
        wrist = lm[0]
        index_tip = lm[8]
        
        if is_armed:
            direction_x = index_tip.x - wrist.x
            direction_y = index_tip.y - wrist.y
            
            direction_mag = np.sqrt(direction_x**2 + direction_y**2)
            if direction_mag > 0.01:
                direction_x /= direction_mag
                direction_y /= direction_mag
            
            base_x = index_tip.x
            base_y = index_tip.y
            
            if self.direction_vector_ema is None:
                self.direction_vector_ema = np.array([direction_x, direction_y])
            else:
                self.direction_vector_ema = (
                    self.direction_alpha * np.array([direction_x, direction_y]) +
                    (1 - self.direction_alpha) * self.direction_vector_ema
                )
            
            cursor_x = base_x
            cursor_y = base_y
        else:
            cursor_x = index_tip.x
            cursor_y = index_tip.y
            self.direction_vector_ema = None
        
        return cursor_x, cursor_y

    def _apply_ema_smoothing(self, raw_x, raw_y):
        if self.cursor_x_ema is None or self.cursor_y_ema is None:
            self.cursor_x_ema = raw_x
            self.cursor_y_ema = raw_y
            return raw_x, raw_y
        
        dx = raw_x - self.cursor_x_ema
        dy = raw_y - self.cursor_y_ema
        
        if abs(dx) > self.deadzone_threshold or abs(dy) > self.deadzone_threshold:
            self.cursor_x_ema = self.ema_alpha * raw_x + (1 - self.ema_alpha) * self.cursor_x_ema
            self.cursor_y_ema = self.ema_alpha * raw_y + (1 - self.ema_alpha) * self.cursor_y_ema
        
        return self.cursor_x_ema, self.cursor_y_ema

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
                    self.cursor_x_ema = None
                    self.cursor_y_ema = None
                    self.direction_vector_ema = None
                    self.last_valid_x = None
                    self.last_valid_y = None
                    self.last_valid_armed = False
                return data

        self.loss_frame_count = 0
        lm = result.multi_hand_landmarks[0].landmark

        armed = self.rules.is_armed(lm)
        
        raw_x, raw_y = self._compute_directional_cursor(lm, armed)
        
        smooth_x, smooth_y = self._apply_ema_smoothing(raw_x, raw_y)

        data["x"] = smooth_x
        data["y"] = smooth_y
        data["armed"] = armed

        if armed:
            data["shoot"] = self.rules.detect_shoot(lm, armed)
        else:
            self.rules.reset()

        self.last_valid_x = data["x"]
        self.last_valid_y = data["y"]
        self.last_valid_armed = data["armed"]

        return data

    def release(self):
        self.cap.release()
