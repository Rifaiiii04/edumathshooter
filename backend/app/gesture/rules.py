import time
import numpy as np

class GestureRules:
    def __init__(self):
        self.BEND_TOL = 0.005
        self.SHOOT_COOLDOWN = 0.3
        self.SHOOT_THRESHOLD = 0.003
        self.PALM_Z_THRESHOLD = -0.002
        self.MIN_VELOCITY_THRESHOLD = 0.002
        
        self.armed_history = []
        self.armed_history_size = 5
        
        self.prev_wrist_y = None
        self.prev_index_y = None
        self.last_shoot_time = 0
        self.wrist_velocity = 0
        self.velocity_history = []
        self.velocity_buffer = []
        self.velocity_buffer_size = 5
        self.shoot_detected = False
        self.shoot_reset_frames = 0
        self.shoot_reset_threshold = 5
        self.shoot_frame_count = 0
        
        self.stable_armed_frames = 0
        self.min_stable_armed_frames = 3

    def reset(self):
        self.prev_wrist_y = None
        self.prev_index_y = None
        self.armed_history = []
        self.velocity_history = []
        self.velocity_buffer = []
        self.shoot_detected = False
        self.shoot_reset_frames = 0
        self.shoot_frame_count = 0
        self.stable_armed_frames = 0

    def is_armed(self, lm):
        index_tip, index_mid, index_pip = lm[8], lm[6], lm[5]
        middle_tip, middle_mid, middle_pip = lm[12], lm[10], lm[9]
        ring_tip, ring_mid, ring_pip = lm[16], lm[14], lm[13]
        pinky_tip, pinky_mid, pinky_pip = lm[20], lm[18], lm[17]

        index_straight = index_tip.y < index_mid.y
        
        middle_bent = (middle_tip.y - middle_mid.y) > self.BEND_TOL or (middle_tip.y - middle_pip.y) > self.BEND_TOL * 0.6
        ring_bent = (ring_tip.y - ring_mid.y) > self.BEND_TOL or (ring_tip.y - ring_pip.y) > self.BEND_TOL * 0.6
        pinky_bent = (pinky_tip.y - pinky_mid.y) > self.BEND_TOL or (pinky_tip.y - pinky_pip.y) > self.BEND_TOL * 0.6

        fingers_bent_count = sum([middle_bent, ring_bent, pinky_bent])
        
        current_armed = index_straight and fingers_bent_count >= 2
        
        self.armed_history.append(current_armed)
        if len(self.armed_history) > self.armed_history_size:
            self.armed_history.pop(0)
        
        armed_count = sum(self.armed_history)
        return armed_count >= 1

    def detect_shoot(self, lm):
        wrist = lm[0]
        index_mcp = lm[5]
        pinky_mcp = lm[17]
        middle_mcp = lm[9]
        index_tip = lm[8]

        palm_z = (wrist.z + index_mcp.z + pinky_mcp.z + middle_mcp.z) / 4
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
            
            self.wrist_velocity = delta_y
            self.velocity_buffer.append(abs(delta_y))
            if len(self.velocity_buffer) > self.velocity_buffer_size:
                self.velocity_buffer.pop(0)
            
            if len(self.velocity_buffer) >= 3:
                velocities = np.array(self.velocity_buffer)
                avg_velocity = np.mean(velocities)
                max_velocity = np.max(velocities)
                std_velocity = np.std(velocities)
            else:
                avg_velocity = abs(delta_y)
                max_velocity = abs(delta_y)
                std_velocity = 0

            is_moving_down = delta_y > self.SHOOT_THRESHOLD
            is_moving_up = delta_y < -self.SHOOT_THRESHOLD
            is_cooldown_ready = now - self.last_shoot_time > self.SHOOT_COOLDOWN
            
            has_sufficient_velocity = max_velocity > self.MIN_VELOCITY_THRESHOLD
            has_consistent_movement = std_velocity < max_velocity * 0.6 or len(self.velocity_buffer) < 3
            is_significant_movement = abs(delta_y) > self.SHOOT_THRESHOLD * 1.2
            
            is_accelerating = False
            if len(self.velocity_buffer) >= 2:
                recent_velocities = self.velocity_buffer[-2:]
                is_accelerating = recent_velocities[-1] > recent_velocities[0] * 1.2

            if (
                (is_moving_down or is_moving_up)
                and is_significant_movement
                and has_sufficient_velocity
                and (has_consistent_movement or is_accelerating)
                and is_cooldown_ready
            ):
                self.last_shoot_time = now
                self.prev_wrist_y = wrist.y
                self.prev_index_y = index_tip.y
                self.velocity_buffer = []
                self.shoot_detected = True
                self.shoot_frame_count = 0
                return True

        self.prev_wrist_y = wrist.y
        self.prev_index_y = index_tip.y
        return False
