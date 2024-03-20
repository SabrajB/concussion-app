import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import "./AddPlayer.css";

const AddPlayer = () => {
    const [name, setName] = useState('');
    const [gender, setGender] = useState('');
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');
    const [notes, setNotes] = useState('');
    const location = useLocation();
    const navigate = useNavigate();

    function handleSubmit(event, t_id) {
        event.preventDefault();
        axios.post(`http://localhost:8081/addplayer`, { name, gender, height, weight, notes, tid: t_id })
            .then(res => {
                console.log(res);
                navigate(`/teams/${t_id}`, {
                    state: {
                        teamID: t_id
                    }
                });
            })
            .catch(err => console.log(err));
    }

    return (
        <div className='add-player-container'>
            <div className='add-player-form'>
                <form onSubmit={(event) => handleSubmit(event, location.state.id)}>
                    <div className="add-player-title"> 
                        <h2>Add Player</h2> 
                    </div>
                    <div className='form-group'>
                        <label htmlFor="name">Name</label>
                        <input
                            type="text"
                            id="name"
                            placeholder='Enter Name'
                            className='form-control'
                            value={name}
                            onChange={e => setName(e.target.value)}
                        />
                    </div>
                    <div className='form-group'>
                        <label htmlFor="gender">Gender</label>
                        <input
                            type="text"
                            id="gender"
                            placeholder='Enter Gender'
                            className='form-control'
                            value={gender}
                            onChange={e => setGender(e.target.value)}
                        />
                    </div>
                    <div className='form-group'>
                        <label htmlFor="height">Height</label>
                        <input
                            type="text"
                            id="height"
                            placeholder='Enter Height in cm'
                            className='form-control'
                            value={height}
                            onChange={e => setHeight(e.target.value)}
                        />
                    </div>
                    <div className='form-group'>
                        <label htmlFor="weight">Weight</label>
                        <input
                            type="text"
                            id="weight"
                            placeholder='Enter Weight in kg'
                            className='form-control'
                            value={weight}
                            onChange={e => setWeight(e.target.value)}
                        />
                    </div>
                    <div className='form-group'>
                        <label htmlFor="notes">Notes</label>
                        <input
                            type="text"
                            id="notes"
                            placeholder='Enter Notes'
                            className='form-control'
                            value={notes}
                            onChange={e => setNotes(e.target.value)}
                        />
                    </div>
                    <button className='submit-button'>Submit</button>
                </form>
            </div>
        </div>
    );
};

export default AddPlayer;
