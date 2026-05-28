import React from 'react'
import 'react-circular-progressbar/dist/styles.css';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';


function Timer({timeLeft, totalTime}) {
  const percentage = (timeLeft / totalTime) * 100;

  return (
    <div className='w-20 h-20'>
      <CircularProgressbar
        value={percentage}
        text={`${Math.ceil(timeLeft)}s`}
        styles={buildStyles({
          strokeLinecap: 'round',
          pathColor: '#10b981',
          textColor: '#ef4444',
          trailColor: '#e5e7eb',
          textSize: '28px',
          
        })}
      />
    </div>
  )
}

export default Timer
