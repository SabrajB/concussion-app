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
    navigateTo("/view")
  }
  const testsPage = () => {
    navigateTo("/tests")
  }
  return (
    <div>
        <div className="top-area">
            <div className="username">
                <h2>Welcome, User 1032</h2>
            </div>
            <div className="profile-pic">
            </div>
        </div>
        <div className="button-container">
          <button className="record-button"
            onClick={resultsPage}>View Player Data
          </button>
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