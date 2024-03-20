import React from 'react'
import { useNavigate } from "react-router-dom";
import './Dashboard.css'
import profile_pic from './profile-pic.jpg'

const Dashboard = () => {
  const navigateTo = useNavigate();

  const teamsPage = () => {
    navigateTo("/teams")
  }
  const settingsPage = () => {
    navigateTo("/settings")
  }
  const resultsPage = () => {
    navigateTo("/viewdata")
  }
  const testsPage = () => {
    navigateTo("/tests")
  }
  return (
    <div>
        <div className="button-container">
          <button className="teams-button"
            onClick={teamsPage}>Edit Teams
          </button>
          <button className="settings-button"
            onClick={settingsPage}>Settings
          </button>
          <button className="tests-button"
            onClick={testsPage}>Run Tests
          </button>
        </div>
    </div>
  )
}

export default Dashboard;