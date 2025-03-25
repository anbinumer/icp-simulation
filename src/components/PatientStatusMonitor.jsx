// components/PatientStatusMonitor.jsx
import React, { useEffect } from 'react';
import { Activity, Heart } from 'lucide-react';

export const PatientStatusMonitor = ({ status }) => {
  // Handle sounds
  useEffect(() => {
    const heartbeatSound = new Audio('/sounds/heartbeat.mp3');
    
    // Set volume based on severity
    heartbeatSound.volume = status.icpStatus === "critical" ? 0.4 : 0.2;
    
    // Set playback rate based on heart rate
    const playbackRate = status.heartRate / 70;
    heartbeatSound.playbackRate = playbackRate;
    
    // Play the sound
    const interval = setInterval(() => {
      heartbeatSound.play();
    }, 60000 / status.heartRate);
    
    return () => {
      clearInterval(interval);
      heartbeatSound.pause();
    };
  }, [status.heartRate, status.icpStatus]);
  
  // Determine color and animation based on patient condition
  const statusColors = {
    normal: 'text-green-500 border-green-500',
    elevated: 'text-yellow-500 border-yellow-500',
    critical: 'text-red-500 border-red-500',
    herniation: 'text-purple-800 border-purple-800'
  };
  
  const heartbeatSpeed = {
    normal: 'animate-heartbeat',
    elevated: 'animate-heartbeat-fast',
    critical: 'animate-heartbeat-critical',
    herniation: 'animate-heartbeat-erratic'
  };

  return (
    <div className="glass rounded-lg p-6 mb-6 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Activity className="h-6 w-6 text-blue-400 mr-2" />
          <h3 className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">
            Patient Vitals Monitor
          </h3>
        </div>
        <div className={`px-3 py-1 rounded-full text-sm font-bold ${statusColors[status.icpStatus]}`}>
          {status.icpStatus.charAt(0).toUpperCase() + status.icpStatus.slice(1)} ICP
        </div>
      </div>
      
      {/* Heart rate monitor with animation */}
      <div className="mb-4 flex items-center">
        <Heart 
          className={`h-6 w-6 text-red-500 mr-3 ${heartbeatSpeed[status.icpStatus]}`} 
        />
        <div className="flex-1">
          <div className="flex justify-between mb-1">
            <span className="text-sm">Heart Rate</span>
            <span className="font-mono">{status.heartRate} bpm</span>
          </div>
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-red-500"
              style={{
                width: `${(status.heartRate / 150) * 100}%`,
                transition: 'width 1s ease-in-out'
              }}
            ></div>
          </div>
        </div>
      </div>
      
      {/* BP monitor */}
      <div className="mb-4">
        <div className="flex justify-between mb-1">
          <span className="text-sm">Blood Pressure</span>
          <span className="font-mono">{status.bp}</span>
        </div>
        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-500"
            style={{
              width: `${parseInt(status.bp.split('/')[0]) / 200 * 100}%`,
              transition: 'width 1s ease-in-out'
            }}
          ></div>
        </div>
      </div>
      
      {/* GCS and ICP values */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-900 p-3 rounded-lg">
          <div className="text-sm text-gray-400 mb-1">GCS Score</div>
          <div className="text-xl font-bold">{status.gcsScore}/15</div>
        </div>
        <div className="bg-gray-900 p-3 rounded-lg">
          <div className="text-sm text-gray-400 mb-1">ICP Range</div>
          <div className="text-xl font-bold">
            {status.icpStatus === "normal" ? "8-12" : 
             status.icpStatus === "elevated" ? "16-20" : 
             status.icpStatus === "critical" ? "21-30" : 
             status.icpStatus === "herniation" ? ">30" : ""} mmHg
          </div>
        </div>
      </div>
      
      {/* Pupil chart */}
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="text-center">
          <div className="text-sm text-gray-400 mb-2">Right Pupil</div>
          <div className="inline-block w-12 h-12 rounded-full bg-black flex items-center justify-center">
            <div 
              className="rounded-full bg-gray-800" 
              style={{
                width: status.pupilRight.includes("enlarged") ? '8px' : 
                       status.pupilRight.includes("fixed") ? '10px' : '4px',
                height: status.pupilRight.includes("enlarged") ? '8px' : 
                        status.pupilRight.includes("fixed") ? '10px' : '4px'
              }}
            ></div>
          </div>
          <div className="text-xs mt-1">{status.pupilRight}</div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-400 mb-2">Left Pupil</div>
          <div className="inline-block w-12 h-12 rounded-full bg-black flex items-center justify-center">
            <div 
              className="rounded-full bg-gray-800" 
              style={{
                width: status.pupilLeft.includes("enlarged") ? '8px' : 
                       status.pupilLeft.includes("fixed") ? '10px' : '4px',
                height: status.pupilLeft.includes("enlarged") ? '8px' : 
                        status.pupilLeft.includes("fixed") ? '10px' : '4px'
              }}
            ></div>
          </div>
          <div className="text-xs mt-1">{status.pupilLeft}</div>
        </div>
      </div>
    </div>
  );
};