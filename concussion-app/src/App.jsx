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
import Upload from "./components/dashboard/tests/UploadData"
import MMSE from "./components/dashboard/tests/MMSE"
import Header from "./components/Header"
import ViewData from "./components/dashboard/ViewData"

function App() {

  return (
    <>
      <Router>
      <Header></Header>
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
            path="/tests"
            element={<Tests/>}
          /> 

          <Route
            path="/viewdata/*"
            element={<ViewData/>}
          />

          <Route
            path="/tests/:playerid/mmse"
            element={<MMSE/>}
          /> 

          <Route
            path="/tests/:playerid/upload"
            element={<Upload/>}
          /> 
        </Routes>
      </Router>
    </>
  );
}

export default App
