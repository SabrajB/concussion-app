import React, {useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import axios from 'axios'
import "./SelectPlayer.css"


export const Tests = () => {
    const [teams, setTeams] = useState([]);
    const [players, setPlayers] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState('');
    const [selectedPlayer, setSelectedPlayer] = useState('');
    const [teamDropdownOpen, setTeamDropdownOpen] = useState(false);
    const [playerDropdownOpen, setPlayerDropdownOpen] = useState(false);
    const navigate = useNavigate();

  
    useEffect(() => {
        // Fetch teams
        axios.get('http://localhost:8081/teams')
            .then(res => setTeams(res.data))
            .catch(err => console.error(err));
    }, []);

    const handleTeamSelect = (teamId) => {
      setSelectedTeam(teamId);
      setTeamDropdownOpen(false);
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
        <h2>Select player for testing</h2>
        <h4> The testing consists of a Mini Mental State Examination, as well as a gait test. Please setup the environment to record the athletes gait before continuing.</h4>
        <select onChange={(e) => {
          setTeamDropdownOpen(false);
          handleTeamSelect(e.target.value);
          } } value={selectedTeam}
              onFocus={() => setTeamDropdownOpen(true)}
              onBlur={() => setTeamDropdownOpen(false)}
              style={{ marginBottom: teamDropdownOpen ? '200px' : '25px' }}>
          <option value="">Select Team</option>
          {teams.map((team) => (
            <option key={team.ID} value={team.ID}>{team.Name}</option>
          ))}
        </select>
        <select
        onChange={e => {
          setSelectedPlayer(e.target.value);
          setPlayerDropdownOpen(false);} }
        value={selectedPlayer}
        onFocus={() => setPlayerDropdownOpen(true)}
        onBlur={() => setPlayerDropdownOpen(false)}
        style={{ marginBottom: playerDropdownOpen ? `${players.length * 50}px` : '25px' }} // Adjust margin when dropdown is open
      >
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