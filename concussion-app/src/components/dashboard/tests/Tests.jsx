import React, {useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import axios from 'axios'
import "./SelectPlayer.css"


export const Tests = () => {
    const [teams, setTeams] = useState([]);
    const [players, setPlayers] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState('');
    const [selectedPlayer, setSelectedPlayer] = useState('');
    const navigate = useNavigate();

  
    useEffect(() => {
        // Fetch teams
        axios.get('http://localhost:8081/teams')
            .then(res => setTeams(res.data))
            .catch(err => console.error(err));
    }, []);

    const handleTeamSelect = (teamId) => {
      setSelectedTeam(teamId);
      axios.get(`http://localhost:8081/players/${teamId}`)
      .then(res => setPlayers(res.data))
      .catch(err => console.error(err));
      // Do something with the selected team
    };

    const handleSelectPlayer = () => {
        
        navigate(
          `${selectedPlayer}/mmse`,
          {
            state: {
              pid: selectedPlayer
            }
          });
      }
  
    return (
      <div className="select">
        <select onChange={(e) => handleTeamSelect(e.target.value)} value={selectedTeam}>
          <option value="">Select Team</option>
          {teams.map((team) => (
            <option key={team.ID} value={team.ID}>{team.Name}</option>
          ))}
        </select>
        <select onChange={(e) => setSelectedPlayer(e.target.value)} value={selectedPlayer}>
            <option value="">Select Player</option>
            {players.map((player) => (
              <option key={player.PID} value={player.PID}>{player.Name}</option>
            ))}
        </select>

        <button onClick={handleSelectPlayer}>Select Player</button>


      </div>

      
    );
  }

export default Tests