import time
from enum import Enum

class GestureState(Enum):
    IDLE = "idle"
    ARMED = "armed"
    SHOOTING = "shooting"
    COOLDOWN = "cooldown"

class GestureStateMachine:
    
    def __init__(self):
        self.MIN_ARMED_FRAMES = 1
        self.MIN_IDLE_FRAMES = 2
        self.SHOOT_COOLDOWN = 0.3
        
        self.ARMED_ENTER_THRESHOLD = 0.3
        self.ARMED_EXIT_THRESHOLD = 0.1
        
        self.current_state = GestureState.IDLE
        self.state_history = []
        self.history_size = 7
        self.last_shoot_time = 0
        self.armed_frame_count = 0
        self.idle_frame_count = 0
        
    def update(self, is_armed_raw, is_shoot_raw):
        now = time.time()
        
        self.state_history.append(is_armed_raw)
        if len(self.state_history) > self.history_size:
            self.state_history.pop(0)
        
        if len(self.state_history) > 0:
            armed_ratio = sum(self.state_history) / len(self.state_history)
        else:
            armed_ratio = 0.0
        
        if self.current_state == GestureState.IDLE:
            if is_armed_raw or armed_ratio >= self.ARMED_ENTER_THRESHOLD:
                self.armed_frame_count += 1
                if self.armed_frame_count >= self.MIN_ARMED_FRAMES:
                    self.current_state = GestureState.ARMED
                    self.idle_frame_count = 0
            else:
                self.armed_frame_count = 0
        
        elif self.current_state == GestureState.ARMED:
            if is_shoot_raw and (now - self.last_shoot_time) > self.SHOOT_COOLDOWN:
                self.current_state = GestureState.SHOOTING
                self.last_shoot_time = now
                return (self.current_state, True, True)
            
            if armed_ratio < self.ARMED_EXIT_THRESHOLD:
                self.idle_frame_count += 1
                if self.idle_frame_count >= self.MIN_IDLE_FRAMES:
                    self.current_state = GestureState.IDLE
                    self.armed_frame_count = 0
            else:
                self.idle_frame_count = 0
                return (self.current_state, True, False)
        
        elif self.current_state == GestureState.SHOOTING:
            self.current_state = GestureState.COOLDOWN
            return (self.current_state, True, True)
        
        elif self.current_state == GestureState.COOLDOWN:
            if (now - self.last_shoot_time) > self.SHOOT_COOLDOWN:
                if armed_ratio >= self.ARMED_EXIT_THRESHOLD:
                    self.current_state = GestureState.ARMED
                else:
                    self.current_state = GestureState.IDLE
        
        is_armed_stable = (self.current_state == GestureState.ARMED or 
                          self.current_state == GestureState.SHOOTING or
                          self.current_state == GestureState.COOLDOWN)
        is_shoot_valid = (self.current_state == GestureState.SHOOTING)
        
        return (self.current_state, is_armed_stable, is_shoot_valid)
    
    def reset(self):
        self.current_state = GestureState.IDLE
        self.state_history = []
        self.armed_frame_count = 0
        self.idle_frame_count = 0
        self.last_shoot_time = 0
