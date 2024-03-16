import './App.css'
import SignUpForm from './components/auth/SignUpForm'
import Dashboard from './components/dashboard/Dashboard';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
} from "react-router-dom";
import Teams from "./components/dashboard/Teams"
import Settings from "./components/dashboard/Settings"
import Tests from "./components/dashboard/tests/Tests"
import RecordData from "./components/dashboard/RecordData"

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route
            path="/"
            element={<Dashboard/>}
          />

          <Route
            path="/settings"
            element={<Settings/>}
          />
          
          <Route
            path="/teams/*"
            element={<Teams/>}
          /> 

          <Route
            path="/record"
            element={<RecordData/>}
          /> 

          <Route
            path="/tests"
            element={<Tests/>}
          /> 
        </Routes>
      </Router>
    </>
  );
}

export default App
