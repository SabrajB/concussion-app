import React from 'react';
import { useTimer } from 'react-timer-hook';

export const Timer = ({ expiryTimestamp }) => {
  const {
    seconds,
    minutes,
    start,
  } = useTimer({ expiryTimestamp, autoStart: false, onExpire: () => console.warn('onExpire called') });


  return (
    <div style={{textAlign: 'center'}}>
      <h1>Time Remaining</h1>
      <p>Click start after reading question</p>
      <div style={{fontSize: '100px'}}>
        <span>{minutes}</span>:<span>{seconds}</span>
      </div>
      <button onClick={start}>Start</button>
    </div>
  );
}

export default Timer;