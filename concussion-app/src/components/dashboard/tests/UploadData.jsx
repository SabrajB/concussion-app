import React, { useState, useEffect, CSSProperties } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import HashLoader from 'react-spinners/HashLoader';
import axios from 'axios';
import "./UploadData.css";

export const UploadData = () => {
    const [selectedSideViewFile, setSelectedSideViewFile] = useState(null);
    const [selectedFrontViewFile, setSelectedFrontViewFile] = useState(null);
    const [step, setStep] = useState(1); // Step 1 for side view, Step 2 for front view
    const [strideLength, setStrideLength] = useState(null);
    const [velocity, setVelocity] = useState(null);
    const [sway, setSway] = useState(null);
    const [gets, setGets] = useState(0);
    const [loading, setLoading] = useState(false);

    const { state } = useLocation();
    const navigate = useNavigate();
    const player_id = state.pid;

    const mmse_score = state.mmse_result;


    useEffect(() => {
        console.log(gets);
        if (gets === 3) {
            // const currentDate = new Date();
            // const options = { timeZone: 'America/New_York' }; // Eastern Standard Time (EST)
            // const formattedDate = currentDate.toLocaleString('en-US', options);
            // Perform axios.post request
            axios.post(`http://localhost:8081/addresults`, {strideLength, velocity, sway, mmse_score, player_id})
            .then(res => {
            console.log(res);
            navigate(`/viewdata/${player_id}`, { state: { playerID: player_id } });
            setLoading(false);
        })
            .catch(err => console.log(err));
        }
    }, [gets]);

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
                setLoading(true);
                setStep(3);
                getStrideLength();
                getSway();
                getVelocity();
            })
            .catch(error => console.error('Error uploading front view:', error));
    }

   

    const getStrideLength = () => {
        const filename = selectedSideViewFile.name;

        axios.get(`http://127.0.0.1:5000/user-id/process_video/stride?key=${filename}`)
            .then(response => {
                setStrideLength(response.data);
                setGets(prevCount => prevCount + 1);
            })
            .catch(error => console.error('Error fetching stride length:', error))
    }

    
    const getSway = () => {
        const filename = selectedFrontViewFile.name;

        axios.get(`http://127.0.0.1:5000/user-id/process_video/sway?key=${filename}`)
            .then(response => {
                setSway(response.data);
                setGets(prevCount => prevCount + 1);
            })
            .catch(error => console.error('Error fetching sway:', error))
    }

    
    const getVelocity = () => {
        const filename = selectedSideViewFile.name;

        axios.get(`http://127.0.0.1:5000/user-id/process_video/velocity?key=${filename}`)
            .then(response => {
                setVelocity(response.data);
                setGets(prevCount => prevCount + 1); 
            })
            .catch(error => console.error('Error fetching Velocity:', error))
    }

     

    return (
        <div className="upload-module">
            {step === 1 && (
                <div className="upload-card">
                    <h1>Upload Side View Video</h1>
                    <label className="custom-file-upload">
                        <input type="file" onChange={handleSideViewFileInput} />
                    </label>
                    <button onClick={handleUploadSideView}>Upload Side View</button>
                </div>
            )}
            {step === 2 && (
                <div className="upload-card">
                    <h1>Upload Front View Video</h1>
                    <label className="custom-file-upload">
                        <input type="file" onChange={handleFrontViewFileInput} />
                    </label>
                    <button onClick={handleUploadFrontView}>Upload Front View</button>
                </div>
            )}
            {step === 3 && loading && (
                <div className="spinner">
                    <HashLoader color={"#6A0F49"} loading={loading} size={150}/>
                    <h2> We are awaiting your results. You will be redirected soon.</h2>
                </div>
            )}         
        </div>
    );
}

export default UploadData;
