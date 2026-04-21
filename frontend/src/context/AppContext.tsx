import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

type LevelInfo = 'A1' | 'A2' | 'B1' | 'B2' | 'C1';

interface AppContextType {
  level: LevelInfo;
  setLevel: (lvl: LevelInfo) => void;
  activeScenario: string;
  setActiveScenario: (scenario: string) => void;
  isLiveMode: boolean;
  setIsLiveMode: (val: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [level, setLevel] = useState<LevelInfo>('B1');
  const [activeScenario, setActiveScenario] = useState<string>('Daily de Data Engineering');
  const [isLiveMode, setIsLiveMode] = useState<boolean>(false);

  return (
    <AppContext.Provider value={{ level, setLevel, activeScenario, setActiveScenario, isLiveMode, setIsLiveMode }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppContext must be used within AppProvider");
  return context;
};
