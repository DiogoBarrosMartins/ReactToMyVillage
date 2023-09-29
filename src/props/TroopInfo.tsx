import React, { useEffect, useState } from 'react';
import { fetchAvailableTroops } from '../api/villageApi';

export interface TroopType {
  name: string;
  health: number;
  armor: number;
  attack: number;
  carryCapacity: number;
  trainingTime: number;
  resourcesRequired: Record<string, number>;
  description: string;
}

interface TroopInfoProps {
  building: any;
  selectedTroop: TroopType | null; 
}

const TroopInfo: React.FC<TroopInfoProps> = ({ building }) => {
  const [troopTypes, setTroopTypes] = useState<TroopType[]>([]);
  const [selectedTroop, setSelectedTroop] = useState<string | null>(null);
  const [troopInfo, setTroopInfo] = useState<TroopType | null>(null);
  
  
  useEffect(() => {
    console.log('TroopInfo rendered');
  }, []);


  useEffect(() => {
   
   const fetchData = async () => {
      try {
        const data = await fetchAvailableTroops(building.id);
        setTroopTypes(data);
        setSelectedTroop(data[0]?.name || null); 
      } catch (error) {
        console.error('Failed to fetch troops:', error);
      }
    };
    fetchData();
  }, [building.id]);

  useEffect(() => {
    if (selectedTroop) {
      const selectedTroopInfo = troopTypes.find(troop => troop.name === selectedTroop);
      setTroopInfo(selectedTroopInfo || null);
    }
  }, [selectedTroop, troopTypes]);

  return (
    <div>
       {troopInfo && (
        <div>
          <h3>{troopInfo.name}</h3>
          <p>Health: {troopInfo.health}</p>
          <p>Armor: {troopInfo.armor}</p>
          <p>Attack: {troopInfo.attack}</p>
          <p>Carry Capacity: {troopInfo.carryCapacity}</p>
          <p>Training Time: {troopInfo.trainingTime} seconds</p>
          <h4>Resources Required</h4>
          <ul>
            {Object.entries(troopInfo.resourcesRequired).map(([resource, cost]) => (
              <li key={resource}>
                {resource}: {cost}
              </li>
            ))}
          </ul>
          <p>Description: {troopInfo.description}</p>
        </div>
      )}
    </div>
  );
};

export default TroopInfo;
