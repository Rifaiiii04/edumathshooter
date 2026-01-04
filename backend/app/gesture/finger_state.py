import numpy as np

class FingerStateDetector:
    
    EXTENDED_ANGLE_THRESHOLD = 0.5
    FOLDED_ANGLE_THRESHOLD = 1.0
    NEUTRAL_ANGLE_MIN = 0.3
    NEUTRAL_ANGLE_MAX = 1.2
    
    def __init__(self):
        pass
    
    def compute_angle(self, p1, p2, p3):
        v1 = np.array([p1.x - p2.x, p1.y - p2.y, p1.z - p2.z])
        v2 = np.array([p3.x - p2.x, p3.y - p2.y, p3.z - p2.z])
        
        norm1 = np.linalg.norm(v1)
        norm2 = np.linalg.norm(v2)
        
        if norm1 == 0 or norm2 == 0:
            return np.pi / 2
        
        v1_norm = v1 / norm1
        v2_norm = v2 / norm2
        
        dot_product = np.clip(np.dot(v1_norm, v2_norm), -1.0, 1.0)
        angle = np.arccos(dot_product)
        
        return angle
    
    def get_finger_state(self, lm, finger_type):
        if finger_type == 'index':
            mcp, pip, dip, tip = lm[5], lm[6], lm[7], lm[8]
        elif finger_type == 'middle':
            mcp, pip, dip, tip = lm[9], lm[10], lm[11], lm[12]
        elif finger_type == 'ring':
            mcp, pip, dip, tip = lm[13], lm[14], lm[15], lm[16]
        elif finger_type == 'pinky':
            mcp, pip, dip, tip = lm[17], lm[18], lm[19], lm[20]
        elif finger_type == 'thumb':
            return self._get_thumb_state(lm)
        else:
            return 'NEUTRAL'
        
        angle_pip = self.compute_angle(mcp, pip, dip)
        angle_dip = self.compute_angle(pip, dip, tip)
        
        avg_angle = (angle_pip + angle_dip) / 2
        
        if avg_angle < self.EXTENDED_ANGLE_THRESHOLD:
            return 'EXTENDED'
        elif avg_angle > self.FOLDED_ANGLE_THRESHOLD:
            return 'FOLDED'
        else:
            return 'NEUTRAL'
    
    def _get_thumb_state(self, lm):
        cmc, mcp, ip, tip = lm[2], lm[3], lm[4], lm[5]
        wrist = lm[0]
        
        angle_mcp = self.compute_angle(wrist, mcp, ip)
        angle_ip = self.compute_angle(mcp, ip, tip)
        avg_angle = (angle_mcp + angle_ip) / 2
        
        if avg_angle < 0.6:
            return 'EXTENDED'
        elif avg_angle > 0.9:
            return 'FOLDED'
        else:
            return 'NEUTRAL'
    
    def get_all_finger_states(self, lm):
        return {
            'index': self.get_finger_state(lm, 'index'),
            'middle': self.get_finger_state(lm, 'middle'),
            'ring': self.get_finger_state(lm, 'ring'),
            'pinky': self.get_finger_state(lm, 'pinky'),
            'thumb': self.get_finger_state(lm, 'thumb')
        }
