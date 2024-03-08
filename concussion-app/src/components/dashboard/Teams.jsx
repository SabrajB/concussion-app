import React from 'react'
import {Routes, Route} from 'react-router-dom'
import TeamTable from "./TeamTable"
import CreateTeam from './CreateTeam'
import TeamView from './TeamView'
import AddPlayer from './AddPlayer'
import 'bootstrap/dist/css/bootstrap.min.css'

const Teams = () => { 
  return (
    <div>
      <Routes>
        <Route path='/' element={<TeamTable />}></Route>
          <Route path="/create" element={<CreateTeam />}></Route>
          <Route path="/:id" element={<TeamView />}></Route>
            <Route path="/:id/addplayer" element={<AddPlayer />}></Route>
      </Routes>
    </div>
  );
}

export default Teams;