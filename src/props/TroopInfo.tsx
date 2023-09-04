import React, { useState, useEffect } from 'react';
import { fetchAllTroopTypes } from '../api/villageApi'; // Import the API function for fetching troop types
import { TroopTypeDTO } from '../api/villageApi';
import { Building } from './BuildingDetailsProps'; // Replace 'path-to-building-type' with the actual path

function TroopInfo() {
  const [selectedTroopType, setSelectedTroopType] = useState('');
  const [troopInfo, setTroopInfo] = useState<TroopTypeDTO | null>(null); // Initialize as null explicitly
  const [troopTypes, setTroopTypes] = useState<TroopTypeDTO[]>([]);

 
  type TroopTypeToBuildingType = {
    [troopType: string]: string; // Define a mapping from troop type to building type
  };

  useEffect(() => {
    // Fetch troop types when the component mounts
    const fetchData = async () => {
      try {
        const data: TroopTypeDTO[] = await fetchAllTroopTypes();
        setTroopTypes(data);
      } catch (error) {
        console.error('Error fetching troop types:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // When the selectedTroopType changes, find and set the troopInfo
    if (selectedTroopType) {
      const selectedInfo = troopTypes.find((troop) => troop.name === selectedTroopType);
      setTroopInfo(selectedInfo !== undefined ? selectedInfo : null);
    } else {
      // Clear troop info when nothing is selected
      setTroopInfo(null);
    }
  }, [selectedTroopType, troopTypes]);
  const filterTroopTypesByBuilding = (building: Building | null) => {
    if (building && typeof building.type === 'string') {
      // Use troopTypeToBuildingType and requiredLevels here
      const troopTypeToBuildingType: TroopTypeToBuildingType = {
        'HUMAN_FOOT_SOLDIER': 'BARRACKS',
        'ORC_WARRIORS': 'BARRACKS',
        'ELF_SCOUTS': 'BARRACKS',
        'HUMAN_IMPERIAL_GUARD': 'BARRACKS',
        'ORC_BRUTE_WARRIORS': 'BARRACKS',
        'ELF_FOREST_ARCHERS': 'BARRACKS',
        'HUMAN_FOOT_KNIGHT': 'BARRACKS',
        'ORC_BLOODRAGE_BERSERKERS': 'BARRACKS',
        'ELF_ELITE_RANGERS': 'BARRACKS',
        'HUMAN_FOOT_MAGES': 'BARRACKS',
        'ORC_SHAMAN_WARRIORS': 'BARRACKS',
        'ELF_DRUID_WARRIORS': 'BARRACKS',
        'HUMAN_ARCHER_CORPS': 'ARCHERY_RANGE',
        'HUMAN_LONG_BOWMEN': 'ARCHERY_RANGE',
        'HUMAN_CROSSBOWMEN': 'ARCHERY_RANGE',
        'ORC_SHADOW_ARCHERS': 'ARCHERY_RANGE',
        'ORC_POISON_BOWMEN': 'ARCHERY_RANGE',
        'ORC_EXPLOSIVE_ARCHERS': 'ARCHERY_RANGE',
        'ELF_WINDRIDER_ARCHERS': 'ARCHERY_RANGE',
        'ELF_SILVERLEAF_BOWMEN': 'ARCHERY_RANGE',
        'ELF_STORMRIDER_SNIPERS': 'ARCHERY_RANGE',
        'HUMAN_CAVALRY_KNIGHTS': 'STABLE',
        'HUMAN_LIGHT_CAVALRY': 'STABLE',
        'HUMAN_ROYAL_LANCERS': 'STABLE',
        'ORC_BLOODRIDERS': 'STABLE',
        'ORC_WAR_BOARS': 'STABLE',
        'ORC_WOLF_RAIDERS': 'STABLE',
        'ELF_GRYPHON_KNIGHTS': 'STABLE',
        'ELF_FOREST_RIDERS': 'STABLE',
        'ELF_MOONSHADOW_DRAGOONS': 'STABLE',
        'HUMAN_SIEGE_ENGINEERS': 'SIEGE_WORKSHOP',
        'HUMAN_CATAPULTS': 'SIEGE_WORKSHOP',
        'HUMAN_TREBUCHETS': 'SIEGE_WORKSHOP',
        'ORC_SIEGE_GOLEMS': 'SIEGE_WORKSHOP',
        'ORC_DEMOLISHERS': 'SIEGE_WORKSHOP',
        'ORC_LAVA_RAMMERS': 'SIEGE_WORKSHOP',
        'ELF_TREANT_SIEGE': 'SIEGE_WORKSHOP',
        'ELF_EARTHEN_CATAPULTS': 'SIEGE_WORKSHOP',
        'ELF_STARBREAKER_BALLISTAE': 'SIEGE_WORKSHOP'
        // Add more troop types and building types as needed
      };
      const troopTypesForBuilding = troopTypeToBuildingType[building.type];

const availableTroops = Array.isArray(troopTypesForBuilding)
  ? troopTypesForBuilding.filter((troopType: string) =>
      isBuildingLevelSufficientForTroop(building, troopType)
    )
  : [];

return availableTroops;

  }
  return [];

      // Define the function outside of the component
function isBuildingLevelSufficientForTroop(building: Building, troopType: string): boolean {

        // Define the required levels for each troop type
        const requiredLevels: Record<string, number> = {
        'HUMAN_FOOT_SOLDIER': 1,
        'ORC_WARRIORS': 1,
        'ELF_SCOUTS': 1,
        'HUMAN_ARCHER_CORPS': 1,
        'ORC_SHADOW_ARCHERS': 1,
        'ELF_WINDRIDER_ARCHERS': 1,
        'HUMAN_CAVALRY_KNIGHTS': 1,
        'ORC_BLOODRIDERS': 1,
        'ELF_GRYPHON_KNIGHTS': 1,
        'HUMAN_SIEGE_ENGINEERS': 1,
        'ORC_SIEGE_GOLEMS': 1,
        'ELF_TREANT_SIEGE': 1,
        'HUMAN_IMPERIAL_GUARD': 2,
        'ORC_BRUTE_WARRIORS': 2,
        'ELF_FOREST_ARCHERS': 2,
        'HUMAN_LONG_BOWMEN': 2,
        'ORC_POISON_BOWMEN': 2,
        'ELF_SILVERLEAF_BOWMEN': 2,
        'HUMAN_LIGHT_CAVALRY': 2,
        'ORC_WAR_BOARS': 2,
        'ELF_FOREST_RIDERS': 2,
        'HUMAN_CATAPULTS': 2,
        'ORC_DEMOLISHERS': 2,
        'ELF_EARTHEN_CATAPULTS': 2,
        'HUMAN_FOOT_KNIGHT': 3,
        'ORC_BLOODRAGE_BERSERKERS': 3,
        'ELF_ELITE_RANGERS': 3,
        'HUMAN_CROSSBOWMEN': 3,
        'ORC_EXPLOSIVE_ARCHERS': 3,
        'ELF_STORMRIDER_SNIPERS': 3,
        'HUMAN_ROYAL_LANCERS': 3,
        'ORC_WOLF_RAIDERS': 3,
        'ELF_MOONSHADOW_DRAGOONS': 3,
        'HUMAN_TREBUCHETS': 3,
        'ORC_LAVA_RAMMERS': 3,
        'ELF_STARBREAKER_BALLISTAE': 3,
        'HUMAN_FOOT_MAGES': 4,
        'ORC_SHAMAN_WARRIORS': 4,
        'ELF_DRUID_WARRIORS': 4,
      };
      const requiredLevel = requiredLevels[troopType];
      return building.level >= requiredLevel;
    }
      // Ensure that these mappings are correctly defined
  
};

  // Render the component
  return (
    <div className="troop-info">
      <h2>Troop Information</h2>
      <select value={selectedTroopType} onChange={(e) => setSelectedTroopType(e.target.value)}>
        <option value="">Select Troop Type</option>
        {troopTypes.map((troop) => (
          <option key={troop.name} value={troop.name}>
            {troop.name}
          </option>
        ))}
      </select>
      {/* Render troop information based on the selected building */}
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
}

export default TroopInfo;
