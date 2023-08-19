import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { fetchVillageData } from './villageApi';
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
  console.log("VillageDataContext rendered");
const [villageData, setVillageData] = useState<VillageData | null>(null);
const username = localStorage.getItem('username') || '';

useEffect(() => {
  console.log("VillageDataContext mounted");
  const loadVillageData = async () => {
    if (username) {
      try {
        const data = await fetchVillageData(username);
        setVillageData(data);
      } catch (error) {
        console.error("Error fetching village data:", error);
      }
    }
  };

  loadVillageData();
}, [username]);

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
