import React from 'react';
import { useVillageData } from '../api/VillageDataContext'; 
import '../css/VillageOverview.css'; 

const VillageOverview: React.FC = () => {
    const { villageData } = useVillageData();
    console.log('Village data in OutterVillageView:', villageData);
   

    if (!villageData) return <div>Loading village details...</div>;

    return (
        <div className="villageOverview">
            <section className="villageDetails">
                <h2>Village: {villageData.name}</h2>
                <p>Coordinates: ({villageData.x}, {villageData.y})</p>
                <p>Last Updated: {villageData.lastUpdated}</p>
                <p className={villageData.isUnderAttack ? 'under-attack' : 'safe'}>
                {villageData.isUnderAttack ? 'Under Attack!' : 'Safe'}
</p>

            </section>

            <section className="resources">
                <h3>Resources</h3>
                <ul>
    {villageData.resourcesDTO.map((resource, index) => (
        <li key={index}>
            <div><span role="img" aria-label="wood">🌲</span> Wood: {resource.wood}</div>
            <div><span role="img" aria-label="wheat">🌾</span> Wheat: {resource.wheat}</div>
            <div><span role="img" aria-label="stone">⛏️</span> Stone: {resource.stone}</div>
            <div><span role="img" aria-label="gold">💰</span> Gold: {resource.gold}</div>
        </li>
    ))}
</ul>

            </section>

            <section className="buildings">
                <h3>Resource Buildings</h3>
                <ul>
                    {villageData.resourceBuildings.map(building => (
                        <li key={building.id}>
                            {building.type} (Level: {building.level})
                        </li>
                    ))}
                </ul>
            </section>

            <section className="buildings">
                <h3>Non-Resource Buildings</h3>
                <ul>
                    {villageData.nonResourceBuildings.map(building => (
                        <li key={building.id}>
                            {building.type} (Level: {building.level})
                        </li>
                    ))}
                </ul>
            </section>

            {/* When we have a troops array in the future, we can uncomment this section 
            <section className="troops">
                <h3>Troops</h3>
                <ul>
                    {villageData.troops.map(troop => (
                        <li key={troop.id}>{troop.name} (Count: {troop.count})</li>
                    ))}
                </ul>
            </section>
            */}
        </div>
    );
}

export default VillageOverview;
