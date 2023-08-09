import React, { createContext, useContext, ReactNode } from 'react';

type VillageData = {
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

const VillageDataContext = createContext<VillageData | null>(null);

type VillageDataProviderProps = {
  children: ReactNode;
  data: VillageData;
};

export const VillageDataProvider: React.FC<VillageDataProviderProps> = ({ children, data }) => {
  return (
    <VillageDataContext.Provider value={data}>
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

export default VillageDataContext;
