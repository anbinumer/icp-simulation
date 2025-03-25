// src/app/page.tsx
"use client"

import ICPSimulationGame from '@/ICPSimulationGame';
import '@/styles/globals.css';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-900">
      <ICPSimulationGame />
    </main>
  );
}