// src/components/PatientStatusMonitor.jsx
import React from 'react';
import { Activity, Heart } from 'lucide-react';

export const PatientStatusMonitor = ({ status }) => {
  // Determine color and pulse rate based on patient condition
  let color = '';
  let pulseRate = '';
  let beatsPerMinute = 0;
  
  switch(status.icpStatus) {
    case "normal":
      color = 'bg-green-500';
      pulseRate = 'animate-pulse-normal';
      beatsPerMinute = 70;
      break;
    case "elevated":
      color = 'bg-yellow-500';
      pulseRate = 'animate-pulse-fast';
      beatsPerMinute = 65;
      break;
    case "critical":
      color = 'bg-red-500';
      pulseRate = 'animate-pulse-very-fast';
      beatsPerMinute = 55;
      break;
    case "herniation":
      color = 'bg-red-800';
      pulseRate = 'animate-pulse-erratic';
      beatsPerMinute = 45;
      break;
    default:
      color = 'bg-green-500';
      pulseRate = 'animate-pulse-normal';
      beatsPerMinute = 70;
      break;
  }
  
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <Activity className="h-5 w-5 text-blue-600 mr-2" />
          <h3 className="font-bold text-sm">Patient Vitals Monitor</h3>
        </div>
        <div className="text-sm">{status.icpStatus.charAt(0).toUpperCase() + status.icpStatus.slice(1)} ICP</div>
      </div>
      
      <div className="bg-gray-100 p-4 rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <Heart className={`h-5 w-5 text-red-500 mr-2 ${pulseRate}`} />
            <span>HR: {status.heartRate} bpm</span>
          </div>
          <div>BP: {status.bp}</div>
        </div>
        
        <div className="w-full bg-gray-300 h-2 rounded-full overflow-hidden">
          <div 
            className={`h-full ${color} ${pulseRate}`} 
            style={{
              width: `${status.gcsScore / 15 * 100}%`,
              transition: 'width 1s ease-in-out'
            }}
          ></div>
        </div>
        
        <div className="flex justify-between mt-2 text-sm">
          <div>GCS: {status.gcsScore}/15</div>
          <div>ICP: {status.icpStatus === "normal" ? "8-12" : 
                    status.icpStatus === "elevated" ? "16-20" : 
                    status.icpStatus === "critical" ? "21-30" : 
                    status.icpStatus === "herniation" ? ">30" : ""} mmHg</div>
        </div>
      </div>
    </div>
  );
};