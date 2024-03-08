import React, {useEffect, useState} from 'react'
import axios from 'axios'
import {useLocation, useNavigate} from 'react-router-dom'
import './TeamTable.css'

const TeamView = () => {
    const [player, setPlayer] = useState([])

    const { state } = useLocation();
    const navigate = useNavigate();
    const teamID = state.teamID;

    const handleAddClick = (teamID) => {
        navigate(
          `addplayer`,
          {
            state: {
              id: teamID
            }
          });
      }
  
    useEffect(()=> {
      axios.get(`http://localhost:8081/players/${teamID}`)
      .then(res => setPlayer(res.data))
      .catch(err => console.log(err));
    })
    return (
      <div className='d-flex vw-100 vh-100 bg-primary bg-gra dient justify-content-center align-items-center'>
        <div className='w-50 bg-white rounded p-3'>
          <div className='btn btn-success' onClick={() => handleAddClick(teamID)}> Add Player +</div>
          <table className='table'>
            <caption>Players</caption>
            <thead>
              <tr>
              <th>Name</th>
              <th>Gender</th>
              <th>Height</th>
              <th>Weight</th>
              <th>Notes</th>
              </tr>
            </thead>
            <tbody>
                {
                  player.map((data, i) => (
                    <tr key={i} >
                      <td>{data.Name}</td>
                      <td>{data.Gender}</td>
                      <td>{data.Height}</td>
                      <td>{data.Weight}</td>
                      <td>{data.Notes}</td>
                      <td>
                        <button className='btn btn-primary'>Archive</button>
                      </td>
                    </tr>
                  ))
                }
            </tbody>
          </table>
        </div>
      </div>
    )
  }

export default TeamView;