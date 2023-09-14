import React, { useState, useEffect } from 'react';

import { upgradeBuildingApi, trainTroops, TroopTypeDTO, fetchAvailableTroops   } from '../api/villageApi';
import { useVillageData } from '../api/VillageDataContext';
import  TroopInfo  from './TroopInfo'; 
import { TroopType } from './TroopInfo';


export interface Building {
id: number;
resourcesNeeded: number[];
name: string;
level: number;
nextLevelProductionRate: number;
productionRate: number;
type: string;
ownerUsername: number;
}

interface BuildingDetailsProps {
building: Building;
onClose: () => void;
setUpgradeQueue: React.Dispatch<React.SetStateAction<QueuedBuilding[]>>;
upgradeQueue: any[];
onUpgradeSuccess?: () => void;
constructions: any[];
troopTypes: TroopTypeDTO[];
}

export type QueuedBuilding = {
id: number;
type: string;
endTime: number;
villageId: number;
};



const buildingDescriptions: { [key: string]: string } = {
  'FARM': 'A place to cultivate crops.',
  'QUARRY': 'Extracts stone from the earth.',
  'MINE': 'A deep pit where minerals are extracted.',
  'FOREST': 'A dense collection of trees.',
  'PUB': 'A place for villagers to relax.',
  'BARRACKS': 'Trains and houses soldiers.',
  'GRAIN_SILO': 'Stores grains for future use.',
  'STORAGE': 'A place to store goods.',
  'RESEARCH_CENTER': 'Innovates and discovers new techniques.',
  'STABLE': 'Houses and trains cavalry units.',
  'SIEGE_WORKSHOP': 'Produces siege weapons.'
  };
  

const BuildingDetails: React.FC<BuildingDetailsProps> = ({
building,
onClose,
onUpgradeSuccess,
constructions
,}) => {
const villageDataContext = useVillageData();
const villageData = villageDataContext?.villageData;
const [troopQuantity] = useState<number>(0);
const [troopTypes, setTroopTypes] = useState<TroopType[]>([]);
const [selectedTroop, setSelectedTroop] = useState<TroopType | null>(null);

useEffect(() => {
    const fetchTroops = async () => {
      try {
        const troops = await fetchAvailableTroops(building.id);
        setTroopTypes(troops);
      } catch (error) {
        console.error('Failed to fetch available troops:', error);
      }
    };

    fetchTroops();
  }, [building.id]);



const isBuildingUpgrading = (): boolean => {
return constructions.some((construction: any) => construction.buildingId === building.id);
};


const handleBuildingUpgrade = async () => {
try {
    const buildingId = building.id;
    await upgradeBuildingApi(buildingId);
    window.location.reload();
    onUpgradeSuccess && onUpgradeSuccess();
} catch (error) {
    let errorMessage = 'An unexpected error occurred.';
    if (error instanceof Error) {
    errorMessage = error.message;
    }
    alert(`Failed to upgrade building: ${errorMessage}`);
}
};

const handleTrainTroops = async () => {
try {
    if (selectedTroop && troopQuantity > 0) {
    const response = await trainTroops(villageData.id, selectedTroop.name, troopQuantity);
    if (response.status === 200) {
        alert('Troop queue complete');
        window.location.reload();
    } else {
       alert(Error);
    }
    } 
} catch (error) {
   alert(error);
}
};



return (

  <div className="buildingDetailsWrapper">
  
    <h4>{building.type}</h4>
    <p>{buildingDescriptions[building.type]}</p>

    {(building.type === 'FARM' ||
      building.type === 'QUARRY' ||
      building.type === 'MINE' ||
      building.type === 'FOREST') && (
      <>
        <p>Current Production Rate: {building.productionRate}</p>
        <p>Next Level Production Rate: {building.nextLevelProductionRate}</p>
      </>
    )}

    <p>Level: {building.level}</p>
    <p>Upgrade Cost:</p>
    <ul className="no-bullets">
      {building.resourcesNeeded.map((amount: number, index: number) => {
        let resourceType;
        switch (index) {
          case 0:
            resourceType = 'Wood';
            break;
          case 1:
            resourceType = 'Wheat';
            break;
          case 2:
            resourceType = 'Stone';
            break;
          case 3:
            resourceType = 'Gold';
            break;
          default:
            resourceType = 'Unknown';
        }
        return <li key={index}>{resourceType}: {amount}</li>;
      })}
    </ul>
    <button onClick={onClose}>Close</button>
    <button
      onClick={handleBuildingUpgrade}
      disabled={isBuildingUpgrading()}
    >
      {isBuildingUpgrading() ? 'Already Upgrading' : 'Upgrade'}
    </button>

    {(["barracks", "stable", "archery_range", "siege_workshop"].includes(building.type.toLowerCase())) && (
      <>
        <div className="training-section">
          <h3>Train Troops</h3>
          <div className="troop-selection">
            <label htmlFor="troopSelect">Select Troop Type:</label>
            <select
              id="troopSelect"
              value={selectedTroop ? selectedTroop.name : ''}
              onChange={(e) => setSelectedTroop(e.target.value as unknown as TroopType)}
            >
              <option value="" disabled>Select troop</option>
              {troopTypes.map((troop, index) => (
                <option key={index} value={troop.name}>{troop.name}</option>
              ))}
            </select>
            <label htmlFor="troopQuantity">Quantity:</label>
            <input
              id="troopQuantity"
              type="number"
              min="1"
              value={troopQuantity}
              onChange={(e) =>  setSelectedTroop(e.target.value as unknown as TroopType)}
            />
            <button onClick={handleTrainTroops}>Train</button>
          </div>
        </div>
        {selectedTroop && <TroopInfo building={building} selectedTroop={selectedTroop} key={selectedTroop.name}/>} 
      </>
    )}
  </div>
);
}
  export default BuildingDetails;
