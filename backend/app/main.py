import cv2
import mediapipe as mp
import time

mp_hands = mp.solutions.hands
mp_drawing = mp.solutions.drawing_utils

hands = mp_hands.Hands(
    static_image_mode=False,
    max_num_hands=1,
    min_detection_confidence=0.6,
    min_tracking_confidence=0.6
)
cap = cv2.VideoCapture(0)

if not cap.isOpened():
    print("Error Kamera Tidak bisa di buka")

print("kamera aktif. Tekan 'q' untuk keluar.")

prev_wrist_y = None

smooth_x = None
smooth_y = None
alpha = 0.3
OFFSET_X = -100
OFFSET_Y = -75

last_shoot_time = 0
SHOOT_COOLDOWN = 0.5

while True:
    ret, frame = cap.read()
    if not ret:
        print("gagal membaca frame")
        break

    frame = cv2.flip(frame, 1)

    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    result = hands.process(rgb_frame)

    if result.multi_hand_landmarks:
        for hand_landmarks in result.multi_hand_landmarks:
            mp_drawing.draw_landmarks(
                frame, hand_landmarks, mp_hands.HAND_CONNECTIONS
            )

            
            # TELUNJUK
            index_tip = hand_landmarks.landmark[8]
            index_mid = hand_landmarks.landmark[6]
            index_straight = index_tip.y < index_mid.y

            # jari tengah
            middle_tip = hand_landmarks.landmark[12]
            middle_mid = hand_landmarks.landmark[10]

            # jari manis
            ring_tip = hand_landmarks.landmark[16]
            ring_mid = hand_landmarks.landmark[14]

            # kelingking
            pinky_tip = hand_landmarks.landmark[20]
            pinky_mid = hand_landmarks.landmark[18]

            print(
            f"Δmid:{middle_tip.y-middle_mid.y:.3f} "
            f"Δring:{ring_tip.y-ring_mid.y:.3f} "
            f"Δpinky:{pinky_tip.y-pinky_mid.y:.3f}"
            )

            BEND_TOL = 0.005
            middle_bent = (middle_tip.y - middle_mid.y) > BEND_TOL
            ring_bent = (ring_tip.y - ring_mid.y) > BEND_TOL
            pinky_bent = (pinky_tip.y - pinky_mid.y) > BEND_TOL

            is_armed = index_straight and middle_bent and ring_bent and pinky_bent

            screen_width = 800
            screen_height = 600

            raw_x = index_tip.x * screen_width
            raw_y = index_tip.y * screen_height

            if smooth_x is None:
                smooth_x, smooth_y = raw_x, raw_y
            else:
                smooth_x = smooth_x + alpha * (raw_x - smooth_x)
                smooth_y = smooth_y + alpha * (raw_y - smooth_y)
        
            cursor_x = int(smooth_x + OFFSET_X)
            cursor_y = int(smooth_y + OFFSET_Y)
            
            now = time.time()
            cursor_color = (150, 150, 150)

            if is_armed:
                cursor_color = (0, 255, 0)
                if now - last_shoot_time < SHOOT_COOLDOWN:
                    cursor_color = (0, 200, 255)

            cv2.circle(
                frame,
                (cursor_x, cursor_y),
                10,
                cursor_color,
                -1
            )

            size = 15 
            cv2.line(frame, (cursor_x - size, cursor_y), (cursor_x + size, cursor_y), cursor_color, 2)

            cv2.line(frame, (cursor_x, cursor_y - size), (cursor_x, cursor_y + size), cursor_color, 2)

            print(f"CURSOR -> x:{cursor_x}, y:{cursor_y}")
            
            if is_armed:
                print("🔫 POSE GUN (ARMED)")

                wrist = hand_landmarks.landmark[0]
                index_mcp = hand_landmarks.landmark[5]
                pinky_mcp = hand_landmarks.landmark[17]

                palm_z = (wrist.z + index_mcp.z + pinky_mcp.z) / 3

                print(f"palm_z: {palm_z:.3f}")
                
                is_facing_camera = palm_z < -0.005

                current_wrist_y = wrist.y
                
                if prev_wrist_y is not None:
                    delta_y = prev_wrist_y - current_wrist_y
                    print(f"delta_y: {delta_y:.3f}")

                    if delta_y > 0.003 and palm_z < -0.005:
                        if now - last_shoot_time > SHOOT_COOLDOWN:
                            print("🔥 SHOOT!")
                            last_shoot_time = now

                prev_wrist_y = current_wrist_y

            else:
                print("🖐️ BUKAN POSE GUN")
                prev_wrist_y = None

            print("tangan terdeteksi")

    cv2.imshow("SHOOT04 - Hand Scan", frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break


cap.release()
cv2.destroyAllWindows()
