"use client"

import ICPSimulationGame from '@/ICPSimulationGame';
import '@/styles/animations.css';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <ICPSimulationGame />
    </main>
  );
}