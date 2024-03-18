import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./UploadData.css";

export const UploadData = () => {
    const [selectedSideViewFile, setSelectedSideViewFile] = useState(null);
    const [selectedFrontViewFile, setSelectedFrontViewFile] = useState(null);
    const [step, setStep] = useState(1); // Step 1 for side view, Step 2 for front view
    const [strideLength, setStrideLength] = useState(null);
    const [velocity, setVelocity] = useState(null);
    const [sway, setSway] = useState(null);
    const [name, setName] = useState('');

    const { state } = useLocation();
    const player_id = state.pid;

    const mmse_score = state.mmse_result;

    const handleSideViewFileInput = (e) => {
        setSelectedSideViewFile(e.target.files[0]);
    }

    const handleFrontViewFileInput = (e) => {
        setSelectedFrontViewFile(e.target.files[0]);
    }

    const handleUploadSideView = () => {
        const filename = selectedSideViewFile.name;
        // Upload logic for side view video
        axios.post(`http://localhost:8081/upload/${filename}`)
            .then(() => setStep(2)) // Move to step 2 (front view upload) after side view upload
            .catch(error => console.error('Error uploading side view:', error));
    }

    const handleUploadFrontView = () => {
        const filename = selectedFrontViewFile.name;
        // Upload logic for front view video
        axios.post(`http://localhost:8081/upload/${filename}`)
            .then(() => {
                setStep(3);
                getStrideLength();
                getSway();
                getVelocity();
                setStep(4);
            })
            .catch(error => console.error('Error uploading front view:', error));
    }

   

    const getStrideLength = () => {
        const filename = selectedSideViewFile.name;

        axios.get(`http://127.0.0.1:5000/user-id/process_video/stride?key=${filename}`)
            .then(response => {
                setStrideLength(response.data);
            })
            .catch(error => console.error('Error fetching stride length:', error))
    }

    
    const getSway = () => {
        const filename = selectedFrontViewFile.name;

        axios.get(`http://127.0.0.1:5000/user-id/process_video/sway?key=${filename}`)
            .then(response => {
                setSway(response.data);
            })
            .catch(error => console.error('Error fetching sway:', error))
    }

    
    const getVelocity = () => {
        const filename = selectedSideViewFile.name;

        axios.get(`http://127.0.0.1:5000/user-id/process_video/velocity?key=${filename}`)
            .then(response => {
                setVelocity(response.data);
            })
            .catch(error => console.error('Error fetching Velocity:', error))
    }

    return (
        <div className="upload-module">
            {step === 1 && (
                <>
                    <h1>Upload Side View Video</h1>
                    <label className="custom-file-upload">
                        <input type="file" onChange={handleSideViewFileInput} />
                    </label>
                    <button onClick={handleUploadSideView}>Upload Side View</button>
                </>
            )}
            {step === 2 && (
                <>
                    <h1>Upload Front View Video</h1>
                    <label className="custom-file-upload">
                        <input type="file" onChange={handleFrontViewFileInput} />
                    </label>
                    <button onClick={handleUploadFrontView}>Upload Front View</button>
                </>
            )}
            {step === 3 && (
                <p>Getting your gait results now</p>
            )}
            {step === 4 && (
                <div className="player-results">
                    <p>Player ID: {player_id}</p>
                    <p>MMSE Score: {mmse_score}</p>
                    <p>Stride Length: {strideLength}</p>
                    <p>Sway: {sway}</p>
                    <p>Velocity: {velocity}</p>
                </div>
            )}            
        </div>
    );
}

export default UploadData;
