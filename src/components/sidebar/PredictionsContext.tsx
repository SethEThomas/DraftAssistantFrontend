import React, { createContext, useContext, useState } from 'react';
import { Player } from '../../interfaces/Player';

interface PredictionsContextType {
  predictions: Player[];
  setPredictions: React.Dispatch<React.SetStateAction<Player[]>>;
}

const PredictionsContext = createContext<PredictionsContextType | undefined>(undefined);

export const PredictionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [predictions, setPredictions] = useState<Player[]>([]);
  
  return (
    <PredictionsContext.Provider value={{ predictions, setPredictions }}>
      {children}
    </PredictionsContext.Provider>
  );
};

export const usePredictions = (): PredictionsContextType => {
  const context = useContext(PredictionsContext);
  if (context === undefined) {
    throw new Error('usePredictions must be used within a PredictionsProvider');
  }
  return context;
};
