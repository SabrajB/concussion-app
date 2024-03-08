import React, {useEffect, useState} from 'react'
import axios from 'axios'
import {Link, useNavigate} from 'react-router-dom'
import './TeamTable.css'

const TeamTable = () => {
  const [team, setTeam] = useState([])

  const navigate = useNavigate();
  const handleRowClick = (id) => {
    navigate(
      `/teams/${id}`,
      {
        state: {
          teamID: id
        }
      });
  }

  useEffect(()=> {
    axios.get('http://localhost:8081/teams')
    .then(res => setTeam(res.data))
    .catch(err => console.log(err));
  }, [])
  return (
    <div className='d-flex vw-100 vh-100 bg-primary bg-gradient justify-content-center align-items-center'>
      <div className='w-50 bg-white rounded p-3'>
        <Link to="create" className='btn btn-success'> Create +</Link>
        <table className='table'>
          <caption> My Teams</caption>
          <thead>
            <tr>
            <th>Name</th>
            <th>Gender</th>
            <th>Sport</th>
            <th>Action</th>
            </tr>
          </thead>
          <tbody>
              {
                team.map((data, i) => (
                  <tr key={i} onClick={() => handleRowClick(data.ID)} >
                    <td>{data.Name}</td>
                    <td>{data.Gender}</td>
                    <td>{data.Sport}</td>
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

export default TeamTable