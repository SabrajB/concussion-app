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
    a = np.array(a) # First
    b = np.array(b) # Mid
    c = np.array(c) # End

    radians = np.arctan2(c[1]-b[1], c[0]-b[0]) - np.arctan2(a[1]-b[1], a[0]-b[0])
    angle = np.abs(radians*180.0/np.pi)

    if angle >180.0:
        angle = 360-angle

    return angle

@app.route("/")
def hello():
    return "Hello world .."

@app.route("/user-id/process_video/stride", methods=['GET'])
def get_stride_length():
    key_vid = request.args.get('key')
    prev_right_ankle_pos = None

    right_ankle_velocity_y_aruco = []

    r_ankle_pos = []

    aruco_size_irl = 0.14001 #m
    scale_factor_aruco = None

    s3_client = boto3.client('s3')
    bucket = 'pace-concussion-videos'
    key = key_vid
    url = s3_client.generate_presigned_url( ClientMethod='get_object', Params={ 'Bucket': bucket, 'Key': key } )
    cap = cv2.VideoCapture(url)
    fps = cap.get(cv2.CAP_PROP_FPS)

    aruco_dict = cv2.aruco.getPredefinedDictionary(cv2.aruco.DICT_4X4_50)
    parameters = cv2.aruco.DetectorParameters()

    with mp_pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.3) as pose:
        while cap.isOpened():
            ret, frame = cap.read()
            if frame is not None:
                
                gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
                corners, ids, rejectedImgPoints = cv2.aruco.detectMarkers(gray, aruco_dict, parameters=parameters)

                if scale_factor_aruco is None and corners != ():
                    marker_size_pixels = np.linalg.norm(corners[0][0][0] - corners[0][0][1])
                    scale_factor_aruco = aruco_size_irl/(marker_size_pixels/min(frame.shape[0], frame.shape[1]))

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

                        r_ankle_velocity_hyp_aruco_y = calculate_velocity_y(prev_right_ankle_pos, right_ankle, fps)

                        prev_right_ankle_pos = right_ankle

                        right_ankle_velocity_y_aruco.append(r_ankle_velocity_hyp_aruco_y)
                    
            else:
                break

        cap.release()
        cv2.destroyAllWindows()

        cutoff_freq = 1
        sampling_freq = 54.24107142857143
        nyquist_freq = 0.5 * sampling_freq
        norm_cuttoff_freq = cutoff_freq / nyquist_freq

        order = 2
        b, a = butter(order, norm_cuttoff_freq, btype='low', analog=False)

        f_rank_y = filtfilt(b, a, right_ankle_velocity_y_aruco)
        
        points = []
        for i in range(1, len(f_rank_y)):
            if f_rank_y[i-1] < 0 and f_rank_y[i] >= 0:
                points.append(i)
            elif f_rank_y[i-1] >= 0 and f_rank_y[i] < 0:
                points.append(i)
        
        points.insert(0,0)

        key_point_tracker = []
        stride_length_tracker = []
        for i in range(len(points)-1):
            min_index = np.argmin(f_rank_y[points[i]:points[i+1]]) + points[i]

            if min_index != points[i] and min_index != points[i+1] and min_index != points[i] + 1 and min_index != points[i] - 1 and min_index != points[i+1] + 1 and min_index != points[i+1] - 1:
                key_point_tracker.append(min_index)
                i += 1 

        stride_begin_end = key_point_tracker[::2]
        if len(stride_begin_end) >= 2:
            for j in range (len(stride_begin_end)-1):
                stride_len = calculate_distance(r_ankle_pos[stride_begin_end[j+1]][0:2],r_ankle_pos[stride_begin_end[j]][0:2])*scale_factor_aruco
                stride_length_tracker.append(stride_len)  
        else:
            return("< 1 full stride detected")     
        
        stride_length = np.mean(stride_length_tracker)

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
    
    prev_right_ankle_pos = None
    right_ankle_velocity_aruco = []
    r_ankle_pos = []

    aruco_size_irl = 0.14001 #m
    scale_factor_aruco = None

    aruco_dict = cv2.aruco.getPredefinedDictionary(cv2.aruco.DICT_4X4_50)
    parameters = cv2.aruco.DetectorParameters()

    with mp_pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.3) as pose:
        while cap.isOpened():
            ret, frame = cap.read()
            if frame is not None:                
                gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
                corners, ids, rejectedImgPoints = cv2.aruco.detectMarkers(gray, aruco_dict, parameters=parameters)

                if scale_factor_aruco is None and corners != ():
                    marker_size_pixels = np.linalg.norm(corners[0][0][0] - corners[0][0][1])
                    print(marker_size_pixels, min(frame.shape[0], frame.shape[1]))
                    scale_factor_aruco = aruco_size_irl/(marker_size_pixels/min(frame.shape[0], frame.shape[1]))

                image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                image.flags.writeable = False

                results = pose.process(image)

                image.flags.writeable = True
                image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)

                landmarks = results.pose_landmarks.landmark
                if results.pose_landmarks is not None:
                    if landmarks and scale_factor_aruco is not None:
                        right_ankle = [landmarks[mp_pose.PoseLandmark.RIGHT_ANKLE.value].x,landmarks[mp_pose.PoseLandmark.RIGHT_ANKLE.value].y, landmarks[mp_pose.PoseLandmark.RIGHT_ANKLE.value].z]

                        r_ankle_pos.append(right_ankle)

                        r_ankle_velocity_hyp_aruco = calculate_velocity(prev_right_ankle_pos, right_ankle, scale_factor_aruco, fps)

                        prev_right_ankle_pos = right_ankle

                        right_ankle_velocity_aruco.append(r_ankle_velocity_hyp_aruco)

                    # else:
                    #     print("no landmarks detected")
            else:
                break

        cap.release()
        cv2.destroyAllWindows()

        velocity = str(np.nanmean(right_ankle_velocity_aruco))

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
    prev_ml_angle = None

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
                        if prev_ml_angle is None:
                            prev_ml_angle = ml_angle
                        ml_sway_angle = ml_angle - prev_ml_angle
                        prev_ml_angle = ml_angle

                        ml_sway.append(ml_sway_angle)
            else:
                break

        cap.release()
        cv2.destroyAllWindows()

        mean_sway = str(np.nanmean(ml_sway))
        max_sway = str(np.max(ml_sway))

    return mean_sway, 200

if __name__ == '__main__':
    app.run(debug=True)