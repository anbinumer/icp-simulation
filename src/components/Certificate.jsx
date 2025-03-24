// src/components/Certificate.jsx
import React from 'react';
import { Button } from '@/components/ui/button';

export const Certificate = ({ playerName, gameState, onClose, getBadgeAndRank }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-3xl w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Your Certificate</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>
        
        <div className="border-8 border-blue-200 p-8 bg-white rounded-lg mb-6">
          <div className="text-center">
            <div className="text-blue-700 text-2xl font-bold mb-1">Skilldemy</div>
            <div className="text-gray-500 text-sm mb-6">Healthcare Education Excellence</div>
            
            <div className="text-xl font-serif mb-2">Certificate of Completion</div>
            <div className="text-sm text-gray-600 mb-6">This certifies that</div>
            
            <div className="text-2xl font-bold mb-6 border-b-2 border-gray-200 pb-2">
              {playerName}
            </div>
            
            <div className="text-sm text-gray-600 mb-4">
              Has successfully completed the
            </div>
            
            <div className="text-xl font-bold mb-2">
              ICP Management Clinical Simulation
            </div>
            
            <div className="text-sm text-gray-600 mb-6">
              with a score of <span className="font-bold">{gameState.score + gameState.bonusPoints}</span> points
              <br />
              Achieving the rank of <span className="font-bold">{getBadgeAndRank(gameState.score + gameState.bonusPoints, gameState.totalPossibleScore, gameState.icpStatus).rank}</span>
              <br />
              and earning the <span className="font-bold">{getBadgeAndRank(gameState.score + gameState.bonusPoints, gameState.totalPossibleScore, gameState.icpStatus).badge}</span> badge
            </div>
            
            <div className="flex justify-between items-center mt-10">
              <div className="text-center flex-1">
                <div className="text-sm italic mb-1">Date</div>
                <div className="font-bold">{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
              </div>
              
              <div className="border-t-2 border-gray-300 w-12 mx-4"></div>
              
              <div className="text-center flex-1">
                <div className="text-sm italic mb-1">Signature</div>
                <div className="font-bold">Dr. A. Neurologist</div>
                <div className="text-xs">Head of Neuroscience Education</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex space-x-3">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={onClose}
          >
            Close
          </Button>
          <Button 
            className="flex-1"
            onClick={() => {
              alert("Certificate would be downloaded as a PDF in production");
              onClose();
            }}
          >
            Download Certificate
          </Button>
          <Button 
            className="flex-1"
            onClick={() => {
              alert("Certificate would be shared to social media in production");
              onClose();
            }}
          >
            Share Certificate
          </Button>
        </div>
      </div>
    </div>
  );
};