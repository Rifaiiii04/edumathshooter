import numpy as np

class HandOrientationDetector:
    
    def __init__(self):
        self.orientation_history = []
        self.history_size = 5
    
    def detect_orientation(self, lm):
        wrist = lm[0]
        index_mcp = lm[5]
        pinky_mcp = lm[17]
        middle_mcp = lm[9]
        
        v1 = np.array([index_mcp.x - wrist.x, 
                       index_mcp.y - wrist.y, 
                       index_mcp.z - wrist.z])
        v2 = np.array([pinky_mcp.x - wrist.x, 
                       pinky_mcp.y - wrist.y, 
                       pinky_mcp.z - wrist.z])
        
        normal = np.cross(v1, v2)
        norm = np.linalg.norm(normal)
        
        if norm == 0:
            return 'front'
        
        normal = normal / norm
        
        z_component = normal[2]
        
        if z_component > -0.3:
            orientation = 'front'
        else:
            orientation = 'side'
        
        self.orientation_history.append(orientation)
        if len(self.orientation_history) > self.history_size:
            self.orientation_history.pop(0)
        
        if len(self.orientation_history) > 0:
            return max(set(self.orientation_history), key=self.orientation_history.count)
        
        return orientation
    
    def get_angle_adjustment(self, orientation):
        if orientation == 'side':
            return 1.2
        else:
            return 1.0
