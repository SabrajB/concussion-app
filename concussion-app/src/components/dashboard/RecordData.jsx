import React , {useState} from 'react';
import axios from 'axios';
import "./RecordData.css";

export const RecordData = () => {
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileInput = (e) => {
        setSelectedFile(e.target.files[0]);
    }

    const handleUpload = (file) => {
        const filename = file.name;
        axios.post(`http://localhost:8081/upload/${filename}`)
        console.log(file);
    }

    return <div className = "upload-module">
        <h1>React S3 File Upload</h1>
        <label className="custom-file-upload">
            <input type="file" onChange={handleFileInput}/>
        </label>
        <button onClick={() => handleUpload(selectedFile)}> Upload to S3</button>
    </div>
}

export default RecordData;