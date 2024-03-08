import React, { useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom'

const CreateTeam = () => {  
    const [name, SetName] = useState('')
    const [gender, SetGender] = useState('')
    const [sport, SetSport] = useState('')
    const navigate = useNavigate();

    function handleSubmit(event) {
        event.preventDefault();
        axios.post('http://localhost:8081/create', {name, gender, sport})
        .then(res => {
            console.log(res);
            navigate('/teams')
        }).catch(err => console.log(err));
    }
  return (
    <div className='d-flex vw-100 vh-100 bg-primary justify-content-center align-items-center'>
        <div className='w-75 bg-white rounded p-3'>
            <form onSubmit={handleSubmit}>
                <h2>Add Team</h2>
                <div className='mb-2'>
                    <label htmlFor="">Name</label>
                    <input type="text" placeholder='Enter Name' className='form-control'
                    onChange={e => SetName(e.target.value)}
                    />
                </div>
                <div className='mb-2'>
                    <label htmlFor="">Gender</label>
                    <input type="text" placeholder='Enter Gender' className='form-control'
                    onChange={e => SetGender(e.target.value)}
                    />
                </div>
                <div className='mb-2'>
                    <label htmlFor="">Sport</label>
                    <input type="text" placeholder='Enter Sport' className='form-control'
                    onChange={e => SetSport(e.target.value)}
                    />
                </div>
                <button className='btn btn-success'>Submit</button>
            </form>
        </div>
    </div>
  )
}

export default CreateTeam;