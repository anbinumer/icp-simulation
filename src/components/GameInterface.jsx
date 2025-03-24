import React from 'react';

const GameInterface = ({
  gameState,
  currentScenario,
  scenariosCount,
  onMakeDecision,
  onCallDoctor,
  onContinue
}) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Scenario {gameState.currentScenarioIndex + 1} of {scenariosCount}</h2>
      <p className="text-gray-700 text-md italic">{currentScenario.description}</p>

      {gameState.showDoctorAdvice && (
        <div className="p-4 border rounded bg-blue-50 text-blue-800">
          <strong>Doctor's Advice:</strong> {gameState.doctorAdvice}
        </div>
      )}

      {gameState.showOutcome ? (
        <div className={`p-4 border rounded ${gameState.outcome.result === 'correct' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          <strong>{gameState.outcome.result === 'correct' ? 'Correct!' : 'Incorrect.'}</strong>
          <p className="mt-1">{gameState.outcome.feedback}</p>
          <button
            onClick={onContinue}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Continue
          </button>
        </div>
      ) : (
        <>
          <div className="space-y-2">
            <p className="font-medium">What is your priority?</p>
            {currentScenario.options.map((opt, index) => (
              <button
                key={index}
                onClick={() => onMakeDecision(index)}
                className="w-full text-left px-4 py-2 border rounded hover:bg-blue-50"
              >
                {opt.text}
              </button>
            ))}
          </div>

          <button
            onClick={onCallDoctor}
            className="mt-4 px-4 py-2 text-sm bg-yellow-100 text-yellow-800 border border-yellow-400 rounded hover:bg-yellow-200"
          >
            📞 Call a Doctor
          </button>
        </>
      )}
    </div>
  );
};

export default GameInterface;
