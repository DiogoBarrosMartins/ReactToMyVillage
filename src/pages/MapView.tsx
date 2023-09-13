import React, { useState, useEffect } from 'react';
import { fetchSurroundingVillages } from '../api/villageApi';
import { useVillageData } from '../api/VillageDataContext';
import InfoCard from '../props/InfoCard';
import '../css/MapView.css';

interface VillageDTO {
id: number;
name: string;
x: number;
y: number;
}

const MapView: React.FC = () => {

const villageDataContext = useVillageData();
const villageData = villageDataContext?.villageData;

const [surroundingVillages, setSurroundingVillages] = useState<VillageDTO[]>([]);
const [playerPosition, setPlayerPosition] = useState<{ x: number, y: number } | null>({ x: villageData?.x || 0, y: villageData?.y || 0 });
const [selectedSquareInfo, setSelectedSquareInfo] = useState<string | null>(null);


const handleSquareClick = (x: number, y: number) => {
const villageAtThisCoordinate = surroundingVillages.find(village => village.x === x && village.y === y);
if (villageAtThisCoordinate) {
setSelectedSquareInfo(`Coordinates: (${x}, ${y}) - Village: ${villageAtThisCoordinate.name}`);
} else {
setSelectedSquareInfo(`Coordinates: (${x}, ${y}) - Conquerable spot`);
}
};


useEffect(() => {
const fetchVillages = async () => {
    try {
        if (playerPosition) {
            const villagesData = await fetchSurroundingVillages(playerPosition.x, playerPosition.y);
            setSurroundingVillages(villagesData);
        }
    } catch (error) {
        console.error("Failed to fetch surrounding villages:", error);
    }
};


fetchVillages();
}, [playerPosition]);

const movePlayer = (dx: number, dy: number) => {
if (playerPosition) {
    setPlayerPosition((prev) => {
        if (prev) {
            return { x: prev.x + dx, y: prev.y + dy };
        }
        return null;
    });
}
}


const topLeftX = (playerPosition ? playerPosition.x : 0) - 5;
const topLeftY = (playerPosition ? playerPosition.y : 0) - 5;


return (
<div>
    <div className="navigation-controls">
        <button onClick={() => movePlayer(0, -1)}>North</button>
        <button onClick={() => movePlayer(0, 1)}>South</button>
        <button onClick={() => movePlayer(-1, 0)}>West</button>
        <button onClick={() => movePlayer(1, 0)}>East</button>
    </div>

    <div className="main-container">
        {Array.from({ length: 10 }).map((_, rowIndex) => (
            <div className="row" key={rowIndex}>
                {Array.from({ length: 10 }).map((_, colIndex) => {
                    const currentX = topLeftX + colIndex;
                    const currentY = topLeftY + rowIndex;
                    const villageAtThisCoordinate = surroundingVillages.find(village => village.x === currentX && village.y === currentY);
                    
                    return (
                    <div 
key={colIndex}
className={`grid-square ${villageAtThisCoordinate ? 'village' : ''}`}
title={villageAtThisCoordinate ? villageAtThisCoordinate.name : ''}
onClick={() => handleSquareClick(currentX, currentY)}
>
{villageAtThisCoordinate ? "V" : ""}
</div>

                    );
                })}
            </div>
        ))}
    </div>
    {selectedSquareInfo && <InfoCard info={selectedSquareInfo} onClose={() => setSelectedSquareInfo(null)} />}
</div>

);
}

export default MapView;
