import React, { useContext } from 'react';
import  VillageDataContext  from '../api/VillageDataContext'; // Update with the correct path
import '../css/VillageOverview.css'; // Assuming you have a CSS file named VillageOverview.css

const VillageOverview: React.FC = () => {
    const villageData = useContext(VillageDataContext);

    if (!villageData) return <div>Loading village details...</div>;

    return (
        <div className="villageOverview">
            <section className="villageDetails">
                <h2>Village: {villageData.name}</h2>
                <p>Coordinates: ({villageData.x}, {villageData.y})</p>
                <p>Last Updated: {villageData.lastUpdated}</p>
                {/* Assuming you have an underAttack flag, else you can remove this */}
                <p>{villageData.isUnderAttack ? 'Under Attack!' : 'Safe'}</p>
            </section>

            <section className="resources">
                <h3>Resources</h3>
                <ul>
                    {villageData.resourcesDTO.map((resource, index) => (
                        <li key={index}>
                            Wood: {resource.wood} |
                            Wheat: {resource.wheat} |
                            Stone: {resource.stone} |
                            Gold: {resource.gold}
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

            {/* If you have a troops array in the future, you can uncomment this section 
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
