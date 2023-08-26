import React, { useState, useEffect, useCallback  } from 'react';
import { useVillageData } from '../api/VillageDataContext';
import { updateVillageNameApi } from '../api/villageApi';
import '../css/VillageOverview.css'
import BuildingDetails from '../props/BuildingDetailsProps';
import { QueuedBuilding } from '../props/BuildingDetailsProps';


const OutterVillageView: React.FC = () => {
const [upgradeQueue, setUpgradeQueue] = useState<QueuedBuilding[]>([]);

const villageDataContext = useVillageData();
const villageData = villageDataContext?.villageData;

const [isEditing, setIsEditing] = useState(false);
const [newName, setNewName] = useState(villageData?.name || '');
const [showBuildingDetails, setShowBuildingDetails] = useState(false);
const [selectedBuilding, setSelectedBuilding] = useState(null);

const [timers, setTimers] = useState<{ [buildingId: number]: string }>({});

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

const handleLogout = () => {
    // Remove the object from local storage
    localStorage.removeItem('username');  // Replace 'yourObjectName' with the actual key name you used to store the object
    
    // Navigate to the landing page
    window.location.href = '/';  // Assuming '/' is your landing page route or you can use the exact URL of your landing page.
};

useEffect(() => {
    const interval = setInterval(() => {
        const newTimers: { [buildingId: number]: string } = {};

        villageData?.constructionDTOS.forEach((construction: { endsAt:  Date; buildingId: number; }) => {   // <-- 2. Access the constructionDTOS from the context
            const endTime = new Date(construction.endsAt).getTime();
            const now = new Date().getTime();
            const distance = endTime - now;

            // Calculate the remaining time
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            newTimers[construction.buildingId] = `${minutes}m ${seconds}s`;

            if (distance < 0) {
                newTimers[construction.buildingId] = 'EXPIRED';
            }
        });

        setTimers(newTimers);
    }, 1000);

    return () => clearInterval(interval);  // This will clear the interval when the component is unmounted.
}, [villageData?.constructionDTOS]);


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
}, [newName, villageData?.name]);


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
<button onClick={handleLogout}>Logout</button>
<div className="construction-timers">
                {villageData?.constructionDTOS.map((construction: { buildingId:number   }) => (
                    <div key={construction.buildingId}>
                        Building {construction.buildingId}: {timers[construction.buildingId]}
                    </div>
                ))}
            </div>


</section>
</div>
);
};

interface ResourceProps {
    resourcesDTO: any[];
    buildings: any[];
}

const ResourceSection: React.FC<ResourceProps> = ({ resourcesDTO, buildings }) => {
    // Calculate the total production per minute for each resource
    let woodProduction = 0;
    let wheatProduction = 0;
    let stoneProduction = 0;
    let goldProduction = 0;
    

    buildings.forEach(building => {
        if (building.type === 'FOREST') woodProduction += building.productionRate;
        if (building.type === 'FARM') wheatProduction += building.productionRate;
        if (building.type === 'QUARRY') stoneProduction += building.productionRate;
        if (building.type === 'MINE') goldProduction += building.productionRate;
    });

    return (
        <div className="card">
            <section className="resources">
                <h3>Resources</h3>
                <ul className="no-bullets">
                    {resourcesDTO.map((resource: any, index: number) => (
                        <li key={index}>
                            Wood: {resource.wood} ({woodProduction}) |
                            Wheat: {resource.wheat} ({wheatProduction}) |
                            Stone: {resource.stone} ({stoneProduction}) |
                            Gold: {resource.gold} ({goldProduction})
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
<ResourceSection resourcesDTO={villageData?.resourcesDTO || []} buildings={villageData?.resourceBuildings || []} />
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
