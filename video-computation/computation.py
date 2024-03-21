import cv2
import cv2.aruco

import requests

import mediapipe as mp

import numpy as np
import matplotlib.pyplot as plt

from scipy.signal import butter, filtfilt
from flask import Flask, request
from flask_cors import CORS
import boto3

app = Flask(__name__)

CORS(app, resources={r'/*' : {'origins': ['http://localhost:5173']}})


mp_drawing = mp.solutions.drawing_utils
mp_pose = mp.solutions.pose

def calculate_distance(a,b):
    return np.sqrt((a[0]-b[0])**2 + (a[1]-b[1])**2)

def calculate_velocity(prev_pos, cur_pos, ratio, fps_rate):
  delta_t = 1/fps_rate
  if prev_pos == None:
    return 0.0

  delta_d = calculate_distance(cur_pos, prev_pos) * ratio
  velocity = delta_d / delta_t
  return velocity

def calculate_velocity_y(prev_pos, cur_pos, fps_rate):
    delta_t = 1/fps_rate
    if prev_pos == None:
        return 0.0

    delta_d_y =  cur_pos[1] - prev_pos[1]
    velocity_y = delta_d_y / delta_t
    return velocity_y

def calculate_angle(a,b,c):
    a = np.array(a)
    b = np.array(b)
    c = np.array(c)

    radians = np.arctan2(c[1]-b[1], c[0]-b[0]) - np.arctan2(a[1]-b[1], a[0]-b[0])
    angle = np.abs(radians*180.0/np.pi)

    if angle >180.0:
        angle = 360-angle

    return angle

def set_up_aruco_scale(vid_path, start_frame, end_frame):
    cap = cv2.VideoCapture(vid_path)    
    frame_count = 0
    aruco_dict = cv2.aruco.getPredefinedDictionary(cv2.aruco.DICT_4X4_50)
    parameters = cv2.aruco.DetectorParameters()
    aruco_size_irl = 0.1001
    scale_factor_tracker = []
    with mp_pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.3) as pose:
        while cap.isOpened():
            ret, frame = cap.read()
            frame_count += 1
            if frame_count > end_frame:
                break
            if frame_count > start_frame and frame_count < end_frame:
                if frame is not None:
            
                    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
                    corners, ids, rejectedImgPoints = cv2.aruco.detectMarkers(gray, aruco_dict, parameters=parameters)
                    if ids is not None:
                        marker_size_pixels = np.linalg.norm(corners[0][0][0] - corners[0][0][1])
                        scale_factor_aruco = aruco_size_irl/(marker_size_pixels/(min(frame.shape[0], frame.shape[1])))
                        scale_factor_tracker.append(scale_factor_aruco)
                else:
                    break
        cap.release()
        cv2.destroyAllWindows()

        if len(scale_factor_tracker) > 0:
            scale_factor = np.nanmean(scale_factor_tracker)
        else:
            scale_factor = 1.86

    return scale_factor

@app.route("/")
def hello():
    return "Hello world .."

@app.route("/user-id/process_video/stride", methods=['GET'])
def get_stride_length():
    key_vid = request.args.get('key')
    s3_client = boto3.client('s3')
    bucket = 'pace-concussion-videos'
    key = key_vid
    url = s3_client.generate_presigned_url( ClientMethod='get_object', Params={ 'Bucket': bucket, 'Key': key } )
    cap = cv2.VideoCapture(url)
    fps = cap.get(cv2.CAP_PROP_FPS)

    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    start_frame = total_frames // 3
    end_frame = start_frame + (total_frames // 3)
    frame_count = 0

    prev_right_ankle_pos = None
    right_ankle_velocity_y_aruco = []
    r_ankle_pos = []

    prev_left_ankle_pos = None
    left_ankle_velocity_y_aruco = []
    l_ankle_pos = []

    scale_factor_aruco = set_up_aruco_scale(url, start_frame, end_frame)

    with mp_pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.3) as pose:
        while cap.isOpened():
            ret, frame = cap.read()
            frame_count += 1
            if frame_count > start_frame and frame_count < end_frame:
                if frame is not None:
                    frame_count += 1
                    image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                    results = pose.process(image)
                    if results.pose_landmarks is not None:
                        landmarks = results.pose_landmarks.landmark
                        if landmarks and scale_factor_aruco is not None:
                            right_ankle = [landmarks[mp_pose.PoseLandmark.RIGHT_ANKLE.value].x,landmarks[mp_pose.PoseLandmark.RIGHT_ANKLE.value].y, landmarks[mp_pose.PoseLandmark.RIGHT_ANKLE.value].z]
                            r_ankle_pos.append(right_ankle)
                            r_ankle_velocity_hyp_aruco_y = calculate_velocity_y(prev_right_ankle_pos, right_ankle, fps)
                            prev_right_ankle_pos = right_ankle

                            right_ankle_velocity_y_aruco.append(r_ankle_velocity_hyp_aruco_y)

                            left_ankle = [landmarks[mp_pose.PoseLandmark.LEFT_ANKLE.value].x,landmarks[mp_pose.PoseLandmark.LEFT_ANKLE.value].y, landmarks[mp_pose.PoseLandmark.LEFT_ANKLE.value].z]
                            l_ankle_pos.append(left_ankle)
                            l_ankle_velocity_hyp_aruco_y = calculate_velocity_y(prev_left_ankle_pos, left_ankle, fps)
                            prev_left_ankle_pos = left_ankle

                            left_ankle_velocity_y_aruco.append(l_ankle_velocity_hyp_aruco_y)  
                else:
                    break
            elif frame_count > end_frame:
                break

        cap.release()
        cv2.destroyAllWindows()

        cutoff_freq = 1
        sampling_freq = fps
        nyquist_freq = 0.5 * sampling_freq
        norm_cuttoff_freq = cutoff_freq / nyquist_freq

        if len(right_ankle_velocity_y_aruco) > 9:
            order = 2
            b, a = butter(order, norm_cuttoff_freq, btype='low', analog=False)

            f_rank_y = filtfilt(b, a, right_ankle_velocity_y_aruco)
        else:
            f_rank_y = right_ankle_velocity_y_aruco

        if len(left_ankle_velocity_y_aruco) > 9:
            order = 2
            b, a = butter(order, norm_cuttoff_freq, btype='low', analog=False)

            f_lank_y = filtfilt(b, a, left_ankle_velocity_y_aruco)
        else:
            f_lank_y = left_ankle_velocity_y_aruco

        threshold = -0.025
        r_points = []
        for i in range(1, len(f_rank_y)):
            if f_rank_y[i-1] < threshold and f_rank_y[i] >= threshold:
                r_points.append(i)
            elif f_rank_y[i-1] >= threshold and f_rank_y[i] < threshold:
                r_points.append(i)
        
        l_points = []
        for i in range(1, len(f_lank_y)):
            if f_lank_y[i-1] < 0 and f_lank_y[i] >= 0:
                l_points.append(i)
            elif f_lank_y[i-1] >= 0 and f_lank_y[i] < 0:
                l_points.append(i)
        
        r_points.insert(0,0)
        l_points.insert(0,0)

        r_key_point_tracker = []
        r_stride_length_tracker = []
        for i in range(len(r_points)-1):
            r_min_index = np.argmin(f_rank_y[r_points[i]:r_points[i+1]]) + r_points[i]

            if r_min_index != r_points[i] and r_min_index != r_points[i+1] and r_min_index != r_points[i] + 1 and r_min_index != r_points[i] - 1 and r_min_index != r_points[i+1] + 1 and r_min_index != r_points[i+1] - 1:
                r_key_point_tracker.append(r_min_index)
                i += 1 
        
        l_key_point_tracker = []
        l_stride_length_tracker = []
        for i in range(len(l_points)-1):
            l_min_index = np.argmin(f_lank_y[l_points[i]:l_points[i+1]]) + l_points[i]

            if l_min_index != l_points[i] and l_min_index != l_points[i+1] and l_min_index != l_points[i] + 1 and l_min_index != l_points[i] - 1 and l_min_index != l_points[i+1] + 1 and l_min_index != l_points[i+1] - 1:
                l_key_point_tracker.append(l_min_index)
                i += 1 

        r_stride_begin_end = r_key_point_tracker[::2]
        l_stride_begin_end = l_key_point_tracker[::2]
        if len(r_stride_begin_end) >= 2:
            for j in range (len(r_stride_begin_end)-1):
                stride_len = calculate_distance(r_ankle_pos[r_stride_begin_end[j+1]][0:2],r_ankle_pos[r_stride_begin_end[j]][0:2])*scale_factor_aruco
                r_stride_length_tracker.append(stride_len)
                stride_length = str(np.mean(r_stride_length_tracker))  
        elif len(l_stride_begin_end) >= 2:
            for j in range (len(l_stride_begin_end)-1):
                stride_len = calculate_distance(l_ankle_pos[l_stride_begin_end[j+1]][0:2],l_ankle_pos[l_stride_begin_end[j]][0:2])*scale_factor_aruco
                l_stride_length_tracker.append(stride_len)
                stride_length = str(np.mean(l_stride_length_tracker)) 
        else:
            return("N/A")     
        
    return stride_length, 200

@app.route("/user-id/process_video/velocity", methods=['GET'])
def get_mean_velocity():
    key_vid = request.args.get('key')
    s3_client = boto3.client('s3')
    bucket = 'pace-concussion-videos'
    key = key_vid
    url = s3_client.generate_presigned_url( ClientMethod='get_object', Params={ 'Bucket': bucket, 'Key': key } )
    cap = cv2.VideoCapture(url)
    fps = cap.get(cv2.CAP_PROP_FPS)
    
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    start_frame = total_frames // 3
    end_frame = start_frame + (total_frames // 3)
    frame_count = 0

    prev_right_ankle_pos = None
    right_ankle_velocity_aruco = []
    r_ankle_pos = []

    scale_factor_aruco = set_up_aruco_scale(url, start_frame, end_frame)

    with mp_pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.3) as pose:
        while cap.isOpened():
            ret, frame = cap.read()
            frame_count += 1
            if frame_count > start_frame and frame_count < end_frame:
                if frame is not None:                
                    frame_count += 1
                    image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                    image.flags.writeable = False

                    results = pose.process(image)

                    image.flags.writeable = True
                    image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)
                    if results.pose_landmarks is not None:
                        landmarks = results.pose_landmarks.landmark
                        if landmarks and scale_factor_aruco is not None:
                            right_ankle = [landmarks[mp_pose.PoseLandmark.RIGHT_ANKLE.value].x,landmarks[mp_pose.PoseLandmark.RIGHT_ANKLE.value].y, landmarks[mp_pose.PoseLandmark.RIGHT_ANKLE.value].z]

                            r_ankle_pos.append(right_ankle)

                            r_ankle_velocity_hyp_aruco = calculate_velocity(prev_right_ankle_pos, right_ankle, scale_factor_aruco, fps)

                            prev_right_ankle_pos = right_ankle

                            right_ankle_velocity_aruco.append(r_ankle_velocity_hyp_aruco)
                else:
                    break
            elif frame_count > end_frame:
                break

        cap.release()
        cv2.destroyAllWindows()

        cutoff_freq = 3
        sampling_freq = fps
        nyquist_freq = 0.5 * sampling_freq
        norm_cuttoff_freq = cutoff_freq / nyquist_freq

        if len(right_ankle_velocity_aruco) > 9:
            order = 2
            b, a = butter(order, norm_cuttoff_freq, btype='low', analog=False)

            f_rank_vel = filtfilt(b, a, right_ankle_velocity_aruco)
        else:
            f_rank_vel = right_ankle_velocity_aruco

        velocity = str(np.nanmean(f_rank_vel))

    return velocity, 200

@app.route("/user-id/process_video/sway", methods=['GET'])
def get_sway():
    key_vid = request.args.get('key')
    s3_client = boto3.client('s3')
    bucket = 'pace-concussion-videos'
    key = key_vid
    url = s3_client.generate_presigned_url( ClientMethod='get_object', Params={ 'Bucket': bucket, 'Key': key } )
    cap = cv2.VideoCapture(url)

    ml_sway= []

    with mp_pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5) as pose:
        while cap.isOpened():
            ret, frame = cap.read()
            if frame is not None:
                image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                image.flags.writeable = False

                results = pose.process(image)

                image.flags.writeable = True
                image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)

                if results.pose_landmarks is not None:
                    landmarks = results.pose_landmarks.landmark
                    if landmarks:
                        left_hip = [landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].x,landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].y]
                        right_hip = [landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].x,landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].y]
                        left_shoulder = [landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].x,landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].y]
                        right_shoulder = [landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value].x,landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value].y]
                        shoulder_midpoint = [(left_shoulder[0] + right_shoulder[0])/2, (left_shoulder[1] + right_shoulder[1])/2]
                        hip_midpoint = [(left_hip[0] + right_hip[0])/2, (left_hip[1] + right_hip[1])/2]
                        temporary_point = [hip_midpoint[0], shoulder_midpoint[1]]

                        ml_angle = calculate_angle(shoulder_midpoint, hip_midpoint, temporary_point)
                        ml_sway.append(ml_angle)
            else:
                break

        cap.release()
        cv2.destroyAllWindows()

        mean_sway = str(np.nanmean(ml_sway))

    return mean_sway, 200

if __name__ == '__main__':
    app.run(debug=True)