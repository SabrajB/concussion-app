import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import './TeamView.css'; // Import custom CSS file

const TeamView = () => {
    const [players, setPlayers] = useState([]);
    const [team, setTeam] = useState(null);
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

    const handleRowClick = (id) => {
        navigate(`/viewdata/${id}`, {
          state: {
            playerID: id,
          }
        });
      };

    useEffect(() => {
        axios.get(`http://localhost:8081/teaminfo/${teamID}`)
        .then(res => setTeam(res.data))
        .catch(err => console.log(err));

        axios.get(`http://localhost:8081/players/${teamID}`)
            .then(res => setPlayers(res.data))
            .catch(err => console.log(err));
    }, [teamID]); // Make sure to include teamID as a dependency to useEffect

    return (
        <div className='team-view-container'>
             {team && (
                <>
                    <h2>{team[0].Name}</h2>
                    <div className='team-details'>
                        <p>{team[0].Gender}</p>
                        <p>|</p>
                        <p>{team[0].Sport}</p>
                    </div>
                    <button className='add-player-button' onClick={() => handleAddClick(teamID)}>Add Player +</button>
                    <div className='players-container'>
                        {players.map((data, i) => (
                            <div className='player-bubble' key={i} onClick={() => handleRowClick(data.PID)}>
                                <div className='player-name1'>{data.Name}</div>
                                <div className='player-details1'>{data.Gender} | {data.Height}</div>
                            </div>
                        ))}
                    </div>
                </>
            )} 
        </div>
    );
}

export default TeamView;
