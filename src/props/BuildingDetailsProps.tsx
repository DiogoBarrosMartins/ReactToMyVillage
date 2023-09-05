import React, { useState, useEffect } from 'react';

import { upgradeBuildingApi, trainTroops, TroopTypeDTO  } from '../api/villageApi';
import { useVillageData } from '../api/VillageDataContext';
import  TroopInfo  from './TroopInfo'; // Import the TroopInfo component

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

const BuildingDetails: React.FC<BuildingDetailsProps> = ({
building,
onClose,
setUpgradeQueue,
upgradeQueue,
onUpgradeSuccess,
constructions,troopTypes
,}) => {
const villageDataContext = useVillageData();
const villageData = villageDataContext?.villageData;
const [selectedTroopType, setSelectedTroopType] = useState<string>('');
const [troopQuantity, setTroopQuantity] = useState<number>(0);
const [availableTroopTypes, setAvailableTroopTypes] = useState<string[]>([]);



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
    if (selectedTroopType && troopQuantity > 0) {
    const response = await trainTroops(villageData.id, selectedTroopType, troopQuantity);
    if (response.status === 200) {
        alert('Troop queue complete');
        window.location.reload();
    } else {
        // Handle errors (e.g., show an error message)
    }
    } else {
    // Handle invalid input (e.g., show an error message)
    }
} catch (error) {
    // Handle errors (e.g., show an error message)
}
};

return (
<div
    style={{
    zIndex: 10,
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'white',
    padding: '16px',
    border: '1px solid black',
    }}
>
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

    {availableTroopTypes.length > 0 && (
    <div className="troop-production">
    <select
        value={selectedTroopType}
        onChange={(e) => setSelectedTroopType(e.target.value)}
    >
        <option value="">Select Troop Type</option>
        {availableTroopTypes.map((troopType) => (
        <option key={troopType} value={troopType}>
            {troopType}
        </option>
        ))}
    </select>
    <input
        type="number"
        value={troopQuantity}
        onChange={(e) => setTroopQuantity(Number(e.target.value))}
        placeholder="Quantity"
    />
    <button onClick={handleTrainTroops}>Train Troops</button>
    </div>
)}

{/* Render the TroopInfo component here */}
<TroopInfo />
</div>
);
};

export default BuildingDetails;
