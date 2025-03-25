'use client';

import dynamic from 'next/dynamic';

// Import the game component with SSR disabled
const ICPSimulationGame = dynamic(
  () => import('../../src/ICPSimulationGame'),
  { ssr: false }
);

export default function GamePage() {
  return (
    <main>
      <ICPSimulationGame />
    </main>
  );
}