"""
Hand Orientation Detection
Detects hand orientation (front-facing vs side-facing) to adjust thresholds
"""
import numpy as np

class HandOrientationDetector:
    """
    Detects hand orientation to adjust gesture detection thresholds.
    Hand can be front-facing (palm toward camera) or side-facing.
    """
    
    def __init__(self):
        self.orientation_history = []
        self.history_size = 5
    
    def detect_orientation(self, lm):
        """
        Detect hand orientation based on palm normal vector.
        
        Args:
            lm: MediaPipe hand landmarks
        
        Returns:
            'front' or 'side'
        """
        # Use palm landmarks to compute normal vector
        wrist = lm[0]
        index_mcp = lm[5]
        pinky_mcp = lm[17]
        middle_mcp = lm[9]
        
        # Compute two vectors in the palm plane
        v1 = np.array([index_mcp.x - wrist.x, 
                       index_mcp.y - wrist.y, 
                       index_mcp.z - wrist.z])
        v2 = np.array([pinky_mcp.x - wrist.x, 
                       pinky_mcp.y - wrist.y, 
                       pinky_mcp.z - wrist.z])
        
        # Normal vector (cross product)
        normal = np.cross(v1, v2)
        norm = np.linalg.norm(normal)
        
        if norm == 0:
            return 'front'  # Default
        
        normal = normal / norm
        
        # Z-component indicates orientation
        # Positive Z means palm facing away (front-facing to camera)
        # Negative Z means palm facing toward (side-facing)
        z_component = normal[2]
        
        # Threshold for classification
        if z_component > -0.3:  # Palm more toward camera
            orientation = 'front'
        else:  # Palm more to the side
            orientation = 'side'
        
        # Add to history for stability
        self.orientation_history.append(orientation)
        if len(self.orientation_history) > self.history_size:
            self.orientation_history.pop(0)
        
        # Return most common orientation
        if len(self.orientation_history) > 0:
            return max(set(self.orientation_history), key=self.orientation_history.count)
        
        return orientation
    
    def get_angle_adjustment(self, orientation):
        """
        Get angle threshold adjustment based on orientation.
        
        Args:
            orientation: 'front' or 'side'
        
        Returns:
            Multiplier for angle thresholds (1.0 = no adjustment)
        """
        if orientation == 'side':
            # Side-facing hands need more lenient thresholds
            return 1.2  # 20% more lenient
        else:
            return 1.0  # No adjustment for front-facing

