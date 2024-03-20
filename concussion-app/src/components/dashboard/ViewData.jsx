import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import "./ViewData.css"

const ViewData = () => {
  const [player, setPlayer] = useState(null);
  const [results, setResults] = useState([]);
  const { state } = useLocation();
  const playerID = state.playerID;

  const calculatePercentageDifference = (baselineValue, resultValue) => {
    if (baselineValue === 0) return ''; // Prevent division by zero
    const difference = ((resultValue - baselineValue) / baselineValue) * 100;
    return difference;
  };

  useEffect(() => {
    // Fetch player info
    axios.get(`http://localhost:8081/playerinfo/${playerID}`)
      .then(res => setPlayer(res.data))
      .catch(err => console.log(err));

    // Fetch results
    axios.get(`http://localhost:8081/results/${playerID}`)
      .then(res => setResults(res.data))
      .catch(err => console.log(err));
  }, [playerID]);

  // Filter out the last instance from results
  const lastResult = results.length > 0 ? results[results.length - 1] : null;
  const otherResults = results.slice(0, results.length - 1);

  return (
    <div className="Info-header">
      <div className="fixed-section">
      {player && (
        <>
          <h2 className="player-name">{player[0].Name}</h2>
          <div className="player-details-container">
            <div className='player-details'>
              <p>{player[0].Gender}</p>
              <p>|</p>
              <p>{player[0].Height} cm</p>
              <p>|</p>
              <p>{player[0].Weight} kg</p>
            </div>
          </div>
        </>
      )}
        {lastResult && (
          <>
            <h3> Baseline Data </h3>
            <div className="baseline-result-bubble">
              <div className="baseline-details">
                <div className="detail-row">
                  <p className="result-title">Date</p>
                  <p className="result-value">{lastResult.Date.substring(0, 10)}</p>
                </div>
                <div className="detail-row">
                  <p className="result-title">MMSE Score</p>
                  <p className="result-value">{lastResult.MMSEScore}</p>
                </div>
                <div className="detail-row">
                  <p className="result-title">Stride Length</p>
                  <p className="result-value">{lastResult.Stride_Len.substring(0, 6)} m</p>
                </div>
                <div className="detail-row">
                  <p className="result-title">Velocity</p>
                  <p className="result-value">{lastResult.Velocity.substring(0, 6)} m/s</p>
                </div>
                <div className="detail-row">
                  <p className="result-title">Sway</p>
                  <p className="result-value">{lastResult.Sway.substring(0, 6)} deg</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      <div className="results">
        
        {otherResults.length > 0 && (
          <>
            <h3> Latest Data </h3>
            <div className="other-results-container">
              {otherResults.map((result, index) => (
                <div className="result-bubble" key={index}>
                  <div className="baseline-details">
                    <div className="detail-row">
                      <p className="result-title">Date</p>
                      <p className="result-value">{result.Date.substring(0, 10)}</p>
                    </div>
                    <div className="detail-row">
                      <p className="result-title">MMSE Score</p>
                      <p className="result-value">{result.MMSEScore}</p>
                      <p className="result-difference-1" style={{ color: calculatePercentageDifference(lastResult.MMSEScore, result.MMSEScore) >= 0 ? 'green' : 'red' }} >{calculatePercentageDifference(lastResult.MMSEScore, result.MMSEScore).toFixed(2)}%</p>
                    </div>
                    <div className="detail-row">
                      <p className="result-title">Stride Length</p>
                      <p className="result-value">{result.Stride_Len.substring(0, 6)} m</p>
                      <p className="result-difference-2" style={{ color: calculatePercentageDifference(lastResult.Stride_Len, result.Stride_Len) >= 0 ? 'green' : 'red' }} >{calculatePercentageDifference(lastResult.Stride_Len, result.Stride_Len).toFixed(2)}%</p>
                    </div>
                    <div className="detail-row">
                      <p className="result-title">Velocity</p>
                      <p className="result-value">{result.Velocity.substring(0, 6)} m/s</p>
                      <p className="result-difference-3" style={{ color: parseFloat(calculatePercentageDifference(lastResult.Velocity, result.Velocity)) >= 0 ? 'green' : 'red' }} >{calculatePercentageDifference(lastResult.Velocity, result.Velocity).toFixed(2)}%</p>
                    </div>
                    <div className="detail-row">
                      <p className="result-title">Sway</p>
                      <p className="result-value">{result.Sway.substring(0, 6)} deg</p>
                      <p className="result-difference-4" style={{ color: calculatePercentageDifference(lastResult.Sway, result.Sway) >= 0 ? 'green' : 'red' }} >{calculatePercentageDifference(lastResult.Sway, result.Sway).toFixed(2)}%</p>
                    </div>
                  </div>
              </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ViewData;
