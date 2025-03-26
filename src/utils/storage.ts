import { GameState } from '../types';

export const saveGameState = (gameState: GameState): boolean => {
  try {
    localStorage.setItem('icp_simulation_state', JSON.stringify(gameState));
    return true;
  } catch (error) {
    console.error("Error saving game state:", error);
    return false;
  }
};

export const loadGameState = (): GameState | null => {
  try {
    const savedState = localStorage.getItem('icp_simulation_state');
    return savedState ? JSON.parse(savedState) : null;
  } catch (error) {
    console.error("Error loading game state:", error);
    return null;
  }
};

export const clearGameState = (): boolean => {
  try {
    localStorage.removeItem('icp_simulation_state');
    return true;
  } catch (error) {
    console.error("Error clearing game state:", error);
    return false;
  }
};