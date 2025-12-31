import time

class GestureRules:
    def __init__(self):
        self.BEND_TOL = 0.005
        self.SHOOT_COOLDOWN = 0.2
        self.SHOOT_THRESHOLD = 0.0015
        self.PALM_Z_THRESHOLD = -0.002
        
        self.armed_history = []
        self.armed_history_size = 5
        
        self.prev_wrist_y = None
        self.prev_index_y = None
        self.last_shoot_time = 0
        self.wrist_velocity = 0
        self.velocity_history = []

    def reset(self):
        self.prev_wrist_y = None
        self.prev_index_y = None
        self.armed_history = []
        self.velocity_history = []

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

        if self.prev_wrist_y is not None:
            delta_y = self.prev_wrist_y - wrist.y
            
            self.wrist_velocity = delta_y
            self.velocity_history.append(abs(delta_y))
            if len(self.velocity_history) > 2:
                self.velocity_history.pop(0)
            
            max_velocity = max(self.velocity_history) if self.velocity_history else 0

            is_moving_down = delta_y > self.SHOOT_THRESHOLD
            is_moving_up = delta_y < -self.SHOOT_THRESHOLD
            is_cooldown_ready = now - self.last_shoot_time > self.SHOOT_COOLDOWN
            has_good_velocity = max_velocity > self.SHOOT_THRESHOLD * 0.3

            if (
                (is_moving_down or is_moving_up)
                and has_good_velocity
                and is_cooldown_ready
            ):
                self.last_shoot_time = now
                self.prev_wrist_y = wrist.y
                self.prev_index_y = index_tip.y
                self.velocity_history = []
                return True

        self.prev_wrist_y = wrist.y
        self.prev_index_y = index_tip.y
        return False
