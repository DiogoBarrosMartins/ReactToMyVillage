import React from 'react';
import { upgradeBuildingApi } from '../api/villageApi';  // Adjust the path as necessary.

interface Building {
    // properties for the Building type...
    id: number;
    resourcesNeeded: number[];
    name: string;
    level: number;
    nextLevelProductionRate: number;
    productionRate: number;
    type: string;
    ownerUsername: number;
    // ... other properties ...
}

export interface QueuedBuilding {
id: number;
type: string; // Adjust with the correct type if it's an enum or something else
endTime: number; // This is in milliseconds since the epoch
villageId: number;
}

interface BuildingDetailsProps {
    building: Building;  // Assuming there's a type named Building
    onClose: () => void;
    setUpgradeQueue: React.Dispatch<React.SetStateAction<QueuedBuilding[]>>;
    upgradeQueue: any[];  // Adjust the type if it's different
    onUpgradeSuccess?: () => void;  // Adding the new property
    constructions: any[];
}



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

const BuildingDetails: React.FC<BuildingDetailsProps> = ({ building, onClose,  setUpgradeQueue, upgradeQueue, onUpgradeSuccess, constructions }) => {
    
    const isBuildingUpgrading = (): boolean => {
        return constructions.some((construction: any) => construction.buildingId === building.id);
    };
    
    const handleBuildingUpgrade = async () => {
        
        try {
           
             // Assuming this is the villageId, adjust if necessary
            const buildingId = building.id;
            await upgradeBuildingApi( buildingId);
            window.location.reload();
            onUpgradeSuccess && onUpgradeSuccess();  // Notify the p
        } catch (error) {
            let errorMessage = 'An unexpected error occurred.';
            if (error instanceof Error) {  // Type check
                errorMessage = error.message;
            }
            alert(`Failed to upgrade building: ${errorMessage}`);
        }
    };

return (

<div style={{
zIndex: 10,
position: 'absolute',
top: '50%',
left: '50%',
transform: 'translate(-50%, -50%)',
backgroundColor: 'white',
padding: '16px',
border: '1px solid black'
}}>
<h4>{building.type}</h4>
<p>{buildingDescriptions[building.type]}</p>
<p>Current Production Rate: {building.productionRate}</p>
<p>Next Level Production Rate: {building.nextLevelProductionRate}</p>
<p>Level: {building.level}</p>
<p>Upgrade Cost:</p>

<ul className="no-bullets">
{building.resourcesNeeded.map((amount: number, index: number) => {
    let resourceType;
    switch (index) {
        case 0:
            resourceType = "Wood";
            break;
        case 1:
            resourceType = "Wheat";
            break;
        case 2:
            resourceType = "Stone";
            break;
        case 3:
            resourceType = "Gold";
            break;
        default:
            resourceType = "Unknown";
    }
    
    return (
        <li key={index}>
            {resourceType}: {amount}
        </li>
    );
})}
</ul>

<button onClick={onClose}>Close</button>
<button 
    onClick={handleBuildingUpgrade}
    disabled={isBuildingUpgrading()}>
        {isBuildingUpgrading() ? "Already Upgrading" : "Upgrade"}
</button>

</div>

);
};

export default BuildingDetails;

