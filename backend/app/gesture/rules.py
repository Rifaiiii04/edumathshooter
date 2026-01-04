import time
import numpy as np
from app.gesture.finger_state import FingerStateDetector
from app.gesture.gesture_state import GestureStateMachine
from app.gesture.orientation import HandOrientationDetector

class GestureRules:
    
    def __init__(self):
        self.SHOOT_COOLDOWN = 0.3
        self.SHOOT_THRESHOLD = 0.002
        self.MIN_VELOCITY_THRESHOLD = 0.0015
        
        self.prev_wrist_y = None
        self.prev_index_y = None
        self.velocity_buffer = []
        self.velocity_buffer_size = 5
        self.shoot_detected = False
        self.shoot_frame_count = 0
        
        self.finger_detector = FingerStateDetector()
        self.state_machine = GestureStateMachine()
        self.orientation_detector = HandOrientationDetector()
        
        self.palm_center = None
        self.hand_scale = None

    def reset(self):
        self.prev_wrist_y = None
        self.prev_index_y = None
        self.velocity_buffer = []
        self.shoot_detected = False
        self.shoot_frame_count = 0
        self.state_machine.reset()
        self.palm_center = None
        self.hand_scale = None

    def _normalize_landmarks(self, lm):
        wrist = lm[0]
        index_mcp = lm[5]
        middle_mcp = lm[9]
        ring_mcp = lm[13]
        pinky_mcp = lm[17]
        
        palm_center = np.array([
            (wrist.x + index_mcp.x + middle_mcp.x + ring_mcp.x + pinky_mcp.x) / 5,
            (wrist.y + index_mcp.y + middle_mcp.y + ring_mcp.y + pinky_mcp.y) / 5,
            (wrist.z + index_mcp.z + middle_mcp.z + ring_mcp.z + pinky_mcp.z) / 5
        ])
        
        wrist_pos = np.array([wrist.x, wrist.y, wrist.z])
        middle_mcp_pos = np.array([middle_mcp.x, middle_mcp.y, middle_mcp.z])
        hand_scale = np.linalg.norm(middle_mcp_pos - wrist_pos)
        
        self.palm_center = palm_center
        self.hand_scale = max(hand_scale, 0.01)
        
        return palm_center, hand_scale

    def is_armed(self, lm):
        try:
            finger_states = self.finger_detector.get_all_finger_states(lm)
            
            index_not_folded = finger_states['index'] != 'FOLDED'
            middle_folded = finger_states['middle'] in ['FOLDED', 'NEUTRAL']
            ring_folded = finger_states['ring'] in ['FOLDED', 'NEUTRAL']
            pinky_folded = finger_states['pinky'] in ['FOLDED', 'NEUTRAL']
            
            folded_count = sum([middle_folded, ring_folded, pinky_folded])
            is_armed_angle = (index_not_folded and folded_count >= 2)
        except:
            is_armed_angle = False
        
        index_tip, index_mid, index_pip = lm[8], lm[6], lm[5]
        middle_tip, middle_mid, middle_pip = lm[12], lm[10], lm[9]
        ring_tip, ring_mid, ring_pip = lm[16], lm[14], lm[13]
        pinky_tip, pinky_mid, pinky_pip = lm[20], lm[18], lm[17]
        
        index_straight = index_tip.y < index_mid.y
        
        middle_bent = (middle_tip.y - middle_mid.y) > 0.003 or (middle_tip.y - middle_pip.y) > 0.002
        ring_bent = (ring_tip.y - ring_mid.y) > 0.003 or (ring_tip.y - ring_pip.y) > 0.002
        pinky_bent = (pinky_tip.y - pinky_mid.y) > 0.003 or (pinky_tip.y - pinky_pip.y) > 0.002
        
        bent_count = sum([middle_bent, ring_bent, pinky_bent])
        is_armed_distance = index_straight and bent_count >= 2
        
        is_armed_raw = is_armed_distance
        
        current_state, is_armed_stable, _ = self.state_machine.update(is_armed_raw, False)
        
        return is_armed_raw

    def detect_shoot(self, lm, is_armed_current):
        wrist = lm[0]
        index_tip = lm[8]
        now = time.time()

        if self.shoot_detected:
            self.shoot_frame_count += 1
            if self.shoot_frame_count >= 2:
                self.shoot_detected = False
                self.shoot_frame_count = 0
                return False
            return True

        if self.prev_wrist_y is not None:
            delta_y = self.prev_wrist_y - wrist.y
            
            self.velocity_buffer.append(abs(delta_y))
            if len(self.velocity_buffer) > self.velocity_buffer_size:
                self.velocity_buffer.pop(0)
            
            if len(self.velocity_buffer) >= 3:
                velocities = np.array(self.velocity_buffer)
                max_velocity = np.max(velocities)
                std_velocity = np.std(velocities)
            else:
                max_velocity = abs(delta_y)
                std_velocity = 0

            is_moving_down = delta_y > self.SHOOT_THRESHOLD
            is_moving_up = delta_y < -self.SHOOT_THRESHOLD
            is_cooldown_ready = now - self.state_machine.last_shoot_time > self.SHOOT_COOLDOWN
            
            has_sufficient_velocity = max_velocity > self.MIN_VELOCITY_THRESHOLD
            has_consistent_movement = std_velocity < max_velocity * 0.7 or len(self.velocity_buffer) < 3
            is_significant_movement = abs(delta_y) > self.SHOOT_THRESHOLD * 1.0
            
            is_accelerating = False
            if len(self.velocity_buffer) >= 2:
                recent_velocities = self.velocity_buffer[-2:]
                is_accelerating = recent_velocities[-1] > recent_velocities[0] * 1.2

            is_shoot_raw = (
                (is_moving_down or is_moving_up) and
                abs(delta_y) > self.SHOOT_THRESHOLD and
                is_cooldown_ready
            )
            
            current_state, is_armed_stable, is_shoot_valid = self.state_machine.update(
                is_armed_raw=is_armed_current,
                is_shoot_raw=is_shoot_raw
            )
            
            if is_shoot_raw and is_armed_current:
                self.prev_wrist_y = wrist.y
                self.prev_index_y = index_tip.y
                self.velocity_buffer = []
                self.shoot_detected = True
                self.shoot_frame_count = 0
                return True

        self.prev_wrist_y = wrist.y
        self.prev_index_y = index_tip.y
        return False
