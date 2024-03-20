import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './CreateTeam.css'; // Import your custom CSS file

const CreateTeam = () => {  
    const [name, setName] = useState('');
    const [gender, setGender] = useState('');
    const [sport, setSport] = useState('');
    const navigate = useNavigate();

    function handleSubmit(event) {
        event.preventDefault();
        axios.post('http://localhost:8081/create', { name, gender, sport })
            .then(res => {
                console.log(res);
                navigate('/teams');
            })
            .catch(err => console.log(err));
    }

    return (
        <div className='form-container'>
            <form className="my-form" onSubmit={handleSubmit}>
                <div className="add-team-title"> 
                    <h2>Add Team</h2> 
                </div>
                <div className='form-group'>
                    <label htmlFor='name'>Name</label>
                    <input 
                        type='text' 
                        id='name' 
                        placeholder='Enter Name' 
                        className='form-control'
                        value={name}
                        onChange={e => setName(e.target.value)}
                    />
                </div>
                <div className='form-group'>
                    <label htmlFor='gender'>Gender</label>
                    <input 
                        type='text' 
                        id='gender' 
                        placeholder='Enter Gender' 
                        className='form-control'
                        value={gender}
                        onChange={e => setGender(e.target.value)}
                    />
                </div>
                <div className='form-group'>
                    <label htmlFor='sport'>Sport</label>
                    <input 
                        type='text' 
                        id='sport' 
                        placeholder='Enter Sport' 
                        className='form-control'
                        value={sport}
                        onChange={e => setSport(e.target.value)}
                    />
                </div>
                <button className='submit-button'>Submit</button>
            </form>
        </div>
    );
};

export default CreateTeam;
