'use client';

import dynamic from 'next/dynamic';
import React from 'react';
import { Loader2 } from 'lucide-react';

// Import the game component with SSR disabled
const ICPSimulationGame = dynamic(
  () => import('../../src/ICPSimulationGame'),
  { 
    ssr: false,
    loading: () => (
      <div className="flex justify-center items-center min-h-screen bg-slate-900 text-white">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-blue-500" />
          <h2 className="text-xl font-medium">Loading Simulation...</h2>
          <p className="text-gray-400 mt-2">Preparing your neuroscience nursing simulation</p>
        </div>
      </div>
    )
  }
);

export default function GamePage() {
  return (
    <main>
      <ICPSimulationGame />
    </main>
  );
}