import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './TeamTable.css';

const TeamTable = () => {
  const [teams, setTeams] = useState([]);
  const navigate = useNavigate();

  const handleRowClick = (id) => {
    navigate(`${id}`, {
      state: {
        teamID: id,
      }
    });
  };

  useEffect(() => {
    axios.get('http://localhost:8081/teams')
      .then(res => setTeams(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div className="team-grid">
      <h2 className='team-heading'>My Teams</h2>
      <Link to="create" className='create-button'>Create +</Link>
      <div className="team-container">
        {teams.map((team) => (
          <div key={team.ID} className="team-card" onClick={() => handleRowClick(team.ID)}>
            <div className="team-name">{team.Name}</div>
            <div className="team-details1">
              <p>{team.Sport}</p>
              <p>|</p>
              <p>{team.Gender}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamTable;
