import React, { useState, useCallback  } from 'react';
import { useVillageData } from '../api/VillageDataContext';
import { updateVillageNameApi } from '../api/villageApi';
import '../css/VillageOverview.css'
import BuildingDetails from '../props/BuildingDetailsProps';
import { QueuedBuilding } from '../props/BuildingDetailsProps';
import { upgradeBuildingApi } from '../api/villageApi';

const OutterVillageView: React.FC = () => {
const [upgradeQueue, setUpgradeQueue] = useState<QueuedBuilding[]>([]);

const villageDataContext = useVillageData();
const villageData = villageDataContext?.villageData;

const [isEditing, setIsEditing] = useState(false);
const [newName, setNewName] = useState(villageData?.name || '');
const [showBuildingDetails, setShowBuildingDetails] = useState(false);
const [selectedBuilding, setSelectedBuilding] = useState(null);

const buildingIcons: { [key: string]: string } = {
'FARM': '🌾',
'QUARRY': '⛏️',
'MINE': '⚒️',
'FOREST': '🌲',
'PUB': '🍺',
'BARRACKS': '🛡️',
'GRAIN_SILO': '🌽',
'STORAGE': '📦',
'RESEARCH_CENTER': '🔍',
'STABLE': '🐎',
'SIEGE_WORKSHOP': '🔥'
};



const handleNameChange = useCallback(async () => {
if (newName !== villageData?.name) {
const username = localStorage.getItem('username') || '';
if (username) {
const updatedVillage = await updateVillageNameApi(username, newName);
if (updatedVillage) {
setIsEditing(false);
}
}
} else {
setIsEditing(false);
}
}, []);


const handleViewBuilding = (building: any) => {
setSelectedBuilding(building);
setShowBuildingDetails(true);
};

const handleCloseBuildingDetails = () => {
setShowBuildingDetails(false);
};


interface VillageDetailsProps {
isEditing: boolean;
setIsEditing: (value: boolean) => void;
villageData: any; 
newName: string;
setNewName: (name: string) => void;
handleNameChange: () => void;
}

const VillageDetailsSection: React.FC<VillageDetailsProps> = ({ isEditing, setIsEditing, villageData, newName, setNewName, handleNameChange }) => {
const getFormattedTime = (milliseconds: number) => {
const totalSeconds = Math.floor(milliseconds / 1000);
const minutes = Math.floor(totalSeconds / 60);
const seconds = totalSeconds % 60;

return `${minutes}:${seconds.toString().padStart(2, '0')} left`;
};
return (
<div className="card">
<section className="villageDetails">
<h2>
Village: 
{isEditing ? (
    <input 
        value={newName}
        onChange={e => setNewName(e.target.value)}
        onBlur={handleNameChange}
    />
) : (
    <>
        {villageData?.name}
        <span 
            onClick={() => setIsEditing(true)} 
            style={{ color: 'green', marginLeft: '10px', cursor: 'pointer', fontSize: '0.8rem' }}>
            change village name
        </span>
    </>
)}
</h2>
<p>Coordinates: ({villageData?.x}, {villageData?.y})</p>
<p>Last Updated: {villageData?.lastUpdated}</p>
<p>{villageData?.isUnderAttack ? 'Under Attack!' : 'Safe'}</p>

<div>
{upgradeQueue.map(queuedBuilding => (
<div key={queuedBuilding.id}>|
{queuedBuilding.type} upgrading... {getFormattedTime(queuedBuilding.endTime - Date.now())}

</div>
))}
</div>

</section>
</div>
);
};

interface ResourceProps {
resourcesDTO: any[];
}

const ResourceSection: React.FC<ResourceProps> = ({ resourcesDTO }) => {
return (
<div className="card">
<section className="resources">
<h3>Resources</h3>
<ul className="no-bullets">
{resourcesDTO.map((resource: any, index: number) => (
    <li key={index}>
        Wood: {resource.wood} | Wheat: {resource.wheat} | Stone: {resource.stone} | Gold: {resource.gold}
    </li>
))}
</ul>
</section>
</div>
);
};

interface BuildingProps {
buildings: any[]; 
title: string;
}


const BuildingSection: React.FC<BuildingProps> = ({ buildings, title }) => {

return (
<div className="card">
<section className="buildings">
<h3>{title}</h3>
<div className="building-group">
{buildings.map((building: any) => (
<div className="building" key={building.id}>
    <span className="building-icon">{buildingIcons[building.type]}</span>
    {building.type} (Level: {building.level})
    <button 
        className="building-button" 
        onClick={() => handleViewBuilding(building)}>View</button>
</div>
))}
</div>
</section>
</div>
);
};
return (
<div className="villageOverview">
<VillageDetailsSection 
isEditing={isEditing}
setIsEditing={setIsEditing}
villageData={villageData}
newName={newName}
setNewName={setNewName}
handleNameChange={handleNameChange}
/>
<ResourceSection resourcesDTO={villageData?.resourcesDTO || []} />
<BuildingSection buildings={villageData?.resourceBuildings || []} title="Resource Buildings" />
<BuildingSection buildings={villageData?.nonResourceBuildings || []} title="Non-Resource Buildings" /> 
{showBuildingDetails && selectedBuilding && (
  <BuildingDetails 
    building={selectedBuilding}
    onClose={handleCloseBuildingDetails}
    onUpgradeSuccess={() => {
      // Handle what you want to do after a successful upgrade, e.g., refresh the building list
    }}
    setUpgradeQueue={setUpgradeQueue}
    upgradeQueue={upgradeQueue}
  />
)}

</div>
);
};

export default OutterVillageView;
