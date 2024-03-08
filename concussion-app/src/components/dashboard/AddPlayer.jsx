import React, { useState } from 'react'
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom'

const AddPlayer = () => {
    // console.log("HELLO")
    const [name, SetName] = useState('')
    const [gender, SetGender] = useState('')
    const [height, SetHeight] = useState('')
    const [weight, SetWeight] = useState('')
    const [notes, SetNotes] = useState('')

    const location = useLocation();

    const navigate = useNavigate();

    function handleSubmit(event, t_id) {
        console.log(t_id);
        event.preventDefault();
        axios.post(`http://localhost:8081/addplayer`, {name, gender, height, weight, notes, tid: t_id})
        .then(res => {
            console.log(res);
            navigate(`/teams/${t_id}`,{
                state: {
                  teamID: t_id
                }
              })
        }).catch(err => console.log(err));
    }
  return (
    <div className='d-flex vw-100 vh-100 bg-primary justify-content-center align-items-center'>
        <div className='w-75 bg-white rounded p-3'>
            <form onSubmit={(event) => handleSubmit(event, location.state.id)}>
                <h2>Add Player</h2>
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
                    <label htmlFor="">Height</label>
                    <input type="number" placeholder='Enter Height' className='form-control'
                    onChange={e => SetHeight(e.target.value)}
                    />
                </div>
                <div className='mb-2'>
                    <label htmlFor="">Weight</label>
                    <input type="number" placeholder='Enter Weight' className='form-control'
                    onChange={e => SetWeight(e.target.value)}
                    />
                </div>
                <div className='mb-2'>
                    <label htmlFor="">Notes</label>
                    <input type="text" placeholder='Enter Notes' className='form-control'
                    onChange={e => SetNotes(e.target.value)}
                    />
                </div>
                <button className='btn btn-success'>Submit</button>
            </form>
        </div>
     </div>
  )
}

export default AddPlayer;