// src/components/GameInterface.jsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PhoneCall, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { PatientStatusMonitor } from './PatientStatusMonitor';
import { ScoreDisplay } from './ScoreDisplay';

export const GameInterface = ({ 
  gameState, 
  currentScenario, 
  scenariosCount, 
  onMakeDecision, 
  onCallDoctor, 
  onContinue 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Scenario and Decisions */}
      <Card className="col-span-1 md:col-span-2">
        <CardHeader className="bg-blue-50">
          <CardTitle>{currentScenario.title}</CardTitle>
          <div className="text-sm text-gray-500">Scenario {gameState.currentScenarioIndex + 1} of {scenariosCount}</div>
        </CardHeader>
        <CardContent className="p-6">
          {/* Score Display */}
          <ScoreDisplay 
            score={gameState.score}
            bonusPoints={gameState.bonusPoints}
            currentScenarioIndex={gameState.currentScenarioIndex}
            totalScenarios={scenariosCount}
          />
          
          {/* Patient Status Monitor */}
          <PatientStatusMonitor status={gameState} />
          
          <p className="mb-4">{currentScenario.description}</p>
          
          {/* Vital Signs */}
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <h3 className="font-bold mb-2 text-blue-600">Patient Status:</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              <div>
                <span className="font-medium">BP:</span> {gameState.bp}
              </div>
              <div>
                <span className="font-medium">HR:</span> {gameState.heartRate}
              </div>
              <div>
                <span className="font-medium">RR:</span> {gameState.respiratoryPattern}
              </div>
              <div>
                <span className="font-medium">GCS:</span> {gameState.gcsScore}
              </div>
              <div className="col-span-2">
                <span className="font-medium">Pupils:</span> R: {gameState.pupilRight}, L: {gameState.pupilLeft}
              </div>
            </div>
          </div>
          
          {/* Decision Point */}
          {!gameState.showFeedback && !gameState.showDoctorAdvice && (
            <>
              <h3 className="font-bold mb-3">{currentScenario.question}</h3>
              <div className="space-y-3">
                {currentScenario.options.map((option, index) => (
                  <button
                    key={index}
                    className="w-full text-left p-3 rounded border border-gray-200 hover:bg-gray-50"
                    onClick={() => onMakeDecision(index)}
                  >
                    {option.text}
                  </button>
                ))}
              </div>
              
              <div className="mt-4">
                <Button
                  variant="outline"
                  onClick={onCallDoctor}
                  disabled={gameState.doctorCallsRemaining <= 0}
                  className={gameState.doctorCallsRemaining <= 0 ? "opacity-50" : ""}
                >
                  <PhoneCall className="w-4 h-4 mr-2" />
                  Call Doctor ({gameState.doctorCallsRemaining} {gameState.doctorCallsRemaining === 1 ? "call" : "calls"} left)
                </Button>
              </div>
            </>
          )}
          
          {/* Doctor Advice */}
          {gameState.showDoctorAdvice && (
            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <div className="flex items-start mb-2">
                <PhoneCall className="h-5 w-5 text-blue-600 mr-2 mt-1" />
                <h3 className="font-bold">Doctor's Advice:</h3>
              </div>
              <p className="italic">{gameState.doctorAdvice}</p>
              <Button 
                className="mt-4 w-full" 
                onClick={onContinue}
              >
                Continue
              </Button>
            </div>
          )}
          
          {/* Decision Feedback */}
          {gameState.showFeedback && (
            <div className={`p-4 rounded-lg mb-4 ${
              gameState.lastDecision.outcome === "Positive" ? "bg-green-50" :
              gameState.lastDecision.outcome === "Negative" ? "bg-red-50" :
              "bg-yellow-50"
            }`}>
              <div className="flex items-start mb-2">
                {gameState.lastDecision.outcome === "Positive" ? (
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-1" />
                ) : gameState.lastDecision.outcome === "Negative" ? (
                  <XCircle className="h-5 w-5 text-red-600 mr-2 mt-1" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-yellow-600 mr-2 mt-1" />
                )}
                <h3 className="font-bold">{gameState.lastDecision.outcome} Outcome</h3>
              </div>
              <p>{gameState.lastDecision.feedback}</p>
              <Button 
                className="mt-4 w-full" 
                onClick={onContinue}
              >
                Continue
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Resources and Reference */}
      <Card className="col-span-1">
        <CardHeader className="bg-blue-50">
          <CardTitle>Clinical Resources</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="mb-4">
            <h3 className="font-bold text-sm uppercase text-gray-500 mb-2">ICP Normal Ranges</h3>
            <ul className="list-disc pl-5 text-sm">
              <li>Normal: 5-15 mmHg</li>
              <li>Elevated: 16-20 mmHg</li>
              <li>Critical: 21-40 mmHg</li>
              <li>Severe: &gt;40 mmHg (high risk of herniation)</li>
            </ul>
          </div>
          
          <div className="mb-4">
            <h3 className="font-bold text-sm uppercase text-gray-500 mb-2">Cushing's Triad</h3>
            <ul className="list-disc pl-5 text-sm">
              <li>Hypertension (↑ BP)</li>
              <li>Bradycardia (↓ HR)</li>
              <li>Irregular breathing pattern</li>
            </ul>
          </div>
          
          <div className="mb-4">
            <h3 className="font-bold text-sm uppercase text-gray-500 mb-2">ICP Management</h3>
            <ul className="list-disc pl-5 text-sm">
              <li>Elevate head of bed 30-45°</li>
              <li>Maintain neutral head/neck alignment</li>
              <li>Minimize noxious stimuli</li>
              <li>Osmotic therapy (mannitol, hypertonic saline)</li>
              <li>CSF drainage via EVD if placed</li>
              <li>Controlled hyperventilation (temporary)</li>
              <li>Surgical decompression (if medical management fails)</li>
            </ul>
          </div>
          
          <div className="mb-4">
            <h3 className="font-bold text-sm uppercase text-gray-500 mb-2">Herniation Warning Signs</h3>
            <ul className="list-disc pl-5 text-sm">
              <li>Unilateral or bilateral pupil dilation</li>
              <li>Loss of pupillary reflex</li>
              <li>Decorticate or decerebrate posturing</li>
              <li>Rapid decline in GCS</li>
              <li>Cushing's triad (late sign)</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};