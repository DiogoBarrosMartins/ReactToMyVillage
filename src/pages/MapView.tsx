import React, { useState, useEffect } from 'react';
import { fetchSurroundingVillages } from '../api/villageApi';
import { useVillageData } from '../api/VillageDataContext';


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
    const [playerPosition, setPlayerPosition] = useState<{ x: number, y: number } | null>(null);
    
   
    useEffect(() => {
        const fetchVillages = async () => {
                       
            
            if (villageData && (!playerPosition || (playerPosition.x !== villageData.x || playerPosition.y !== villageData.y))) {
                setPlayerPosition({ 
                    x: villageData.x, 
                    y: villageData.y 
                });
            }
            
            if (!playerPosition) {
                console.warn("Player position is not set yet.");
                return;
            }

            try {
                const villagesData = await fetchSurroundingVillages(playerPosition.x, playerPosition.y);
                console.log("Fetched villages data:", villagesData);
                setSurroundingVillages(villagesData);
            } catch (error) {
                console.error("Failed to fetch surrounding villages:", error);
            }
        };

        fetchVillages();
    }, [playerPosition]);

    const movePlayer = (dx: number, dy: number) => {
        setPlayerPosition(prev => {
            if (prev) {
                return { x: prev.x + dx, y: prev.y + dy };
            }
            return prev; // or you can return a default position if needed
        });
    };

    return (
        <div>
            <div className="navigation-controls">
                <button onClick={() => movePlayer(0, -1)}>North</button>
                <button onClick={() => movePlayer(0, 1)}>South</button>
                <button onClick={() => movePlayer(-1, 0)}>West</button>
                <button onClick={() => movePlayer(1, 0)}>East</button>
            </div>
            
            <div className="map-grid">
                {surroundingVillages.map((village: VillageDTO) => (
                    <div key={village.id} className="village-spot">
                        {village.name} ({village.x}, {village.y})
                    </div>
                ))}
            </div>
        </div>
    );
}

export default MapView;

