"""
Gesture State Machine
Manages state transitions: idle → armed → shooting → cooldown
"""
import time
from enum import Enum

class GestureState(Enum):
    """Gesture states for state machine"""
    IDLE = "idle"
    ARMED = "armed"
    SHOOTING = "shooting"
    COOLDOWN = "cooldown"

class GestureStateMachine:
    """
    State machine for gesture detection with temporal consistency.
    Prevents rapid toggling and ensures valid state transitions.
    """
    
    def __init__(self):
        # State persistence thresholds (very responsive)
        self.MIN_ARMED_FRAMES = 1  # Must be armed for 1 frame to transition (immediate)
        self.MIN_IDLE_FRAMES = 2   # Must be idle for 2 frames to exit armed
        self.SHOOT_COOLDOWN = 0.3  # Cooldown after shooting (seconds)
        
        # Hysteresis thresholds (very lenient)
        self.ARMED_ENTER_THRESHOLD = 0.3  # 30% of frames must be armed to enter (very lenient)
        self.ARMED_EXIT_THRESHOLD = 0.1   # 10% of frames must be armed to stay (very lenient)
        
        # State tracking
        self.current_state = GestureState.IDLE
        self.state_history = []  # History of raw gesture detections
        self.history_size = 7    # Keep last 7 frames
        self.last_shoot_time = 0
        self.armed_frame_count = 0
        self.idle_frame_count = 0
        
    def update(self, is_armed_raw, is_shoot_raw):
        """
        Update state machine with raw gesture detection.
        
        Args:
            is_armed_raw: Raw armed detection (boolean)
            is_shoot_raw: Raw shoot detection (boolean)
        
        Returns:
            (current_state, is_armed_stable, is_shoot_valid)
        """
        now = time.time()
        
        # Add to history
        self.state_history.append(is_armed_raw)
        if len(self.state_history) > self.history_size:
            self.state_history.pop(0)
        
        # Compute armed ratio from history
        if len(self.state_history) > 0:
            armed_ratio = sum(self.state_history) / len(self.state_history)
        else:
            armed_ratio = 0.0
        
        # State machine transitions
        if self.current_state == GestureState.IDLE:
            # Transition to ARMED if consistently armed OR if current frame is armed
            if is_armed_raw or armed_ratio >= self.ARMED_ENTER_THRESHOLD:
                self.armed_frame_count += 1
                if self.armed_frame_count >= self.MIN_ARMED_FRAMES:
                    self.current_state = GestureState.ARMED
                    self.idle_frame_count = 0
            else:
                self.armed_frame_count = 0
        
        elif self.current_state == GestureState.ARMED:
            # Check for shooting (only from ARMED state)
            if is_shoot_raw and (now - self.last_shoot_time) > self.SHOOT_COOLDOWN:
                self.current_state = GestureState.SHOOTING
                self.last_shoot_time = now
                return (self.current_state, True, True)
            
            # Exit to IDLE if not consistently armed
            if armed_ratio < self.ARMED_EXIT_THRESHOLD:
                self.idle_frame_count += 1
                if self.idle_frame_count >= self.MIN_IDLE_FRAMES:
                    self.current_state = GestureState.IDLE
                    self.armed_frame_count = 0
            else:
                self.idle_frame_count = 0
                # Stay in ARMED state
                return (self.current_state, True, False)
        
        elif self.current_state == GestureState.SHOOTING:
            # Immediately transition to COOLDOWN
            self.current_state = GestureState.COOLDOWN
            return (self.current_state, True, True)
        
        elif self.current_state == GestureState.COOLDOWN:
            # Wait for cooldown period
            if (now - self.last_shoot_time) > self.SHOOT_COOLDOWN:
                # Return to ARMED if still armed, otherwise IDLE
                if armed_ratio >= self.ARMED_EXIT_THRESHOLD:
                    self.current_state = GestureState.ARMED
                else:
                    self.current_state = GestureState.IDLE
        
        # Return stable armed state and shoot validity
        is_armed_stable = (self.current_state == GestureState.ARMED or 
                          self.current_state == GestureState.SHOOTING or
                          self.current_state == GestureState.COOLDOWN)
        is_shoot_valid = (self.current_state == GestureState.SHOOTING)
        
        return (self.current_state, is_armed_stable, is_shoot_valid)
    
    def reset(self):
        """Reset state machine to initial state"""
        self.current_state = GestureState.IDLE
        self.state_history = []
        self.armed_frame_count = 0
        self.idle_frame_count = 0
        self.last_shoot_time = 0

