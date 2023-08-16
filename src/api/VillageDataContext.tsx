import React, { createContext, useContext, useState, ReactNode } from 'react';

export type VillageData = {
  id: number;
  x: number;
  y: number;
  name: string;
  accountId: number;
  lastUpdated: string;
  resourcesDTO: any[];
  resourceBuildings: any[];
  nonResourceBuildings: any[];
  isUnderAttack: boolean;
  // Add more fields as needed
};


type VillageDataContextValue = {
  villageData: VillageData | null;
  setVillageData: React.Dispatch<React.SetStateAction<VillageData | null>>;
};

const VillageDataContext = createContext<VillageDataContextValue | undefined>(undefined);

export const VillageDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [villageData, setVillageData] = useState<VillageData | null>(null);

  return (
    <VillageDataContext.Provider value={{ villageData, setVillageData }}>
      {children}
    </VillageDataContext.Provider>
  );
};

export const useVillageData = () => {
  const context = useContext(VillageDataContext);
  if (!context) {
    throw new Error('useVillageData must be used within a VillageDataProvider');
  }
  return context;
};

