import time

class GestureRules:
    def __init__(self):
        # === CONFIG ===
        self.BEND_TOL = 0.005
        self.SHOOT_COOLDOWN = 0.5

        # === STATE ===
        self.prev_wrist_y = None
        self.last_shoot_time = 0

    def reset(self):
        self.prev_wrist_y = None

    def is_armed(self, lm):
        index_tip, index_mid = lm[8], lm[6]
        middle_tip, middle_mid = lm[12], lm[10]
        ring_tip, ring_mid = lm[16], lm[14]
        pinky_tip, pinky_mid = lm[20], lm[18]

        index_straight = index_tip.y < index_mid.y
        middle_bent = (middle_tip.y - middle_mid.y) > self.BEND_TOL
        ring_bent = (ring_tip.y - ring_mid.y) > self.BEND_TOL
        pinky_bent = (pinky_tip.y - pinky_mid.y) > self.BEND_TOL

        return index_straight and middle_bent and ring_bent and pinky_bent

    def detect_shoot(self, lm):
        wrist = lm[0]
        index_mcp = lm[5]
        pinky_mcp = lm[17]

        palm_z = (wrist.z + index_mcp.z + pinky_mcp.z) / 3
        now = time.time()

        if self.prev_wrist_y is not None:
            delta_y = self.prev_wrist_y - wrist.y

            if (
                delta_y > 0.003
                and palm_z < -0.005
                and now - self.last_shoot_time > self.SHOOT_COOLDOWN
            ):
                self.last_shoot_time = now
                self.prev_wrist_y = wrist.y
                return True

        self.prev_wrist_y = wrist.y
        return False
