import React, { useState, useEffect, useContext } from "react";
import { fetchVillageData } from "./villageApi"; // Assuming the path is correct

const VillageDataContext = React.createContext<{
  villageData: any;
  setVillageData: React.Dispatch<React.SetStateAction<any>>;
  error: string | null;
} | null>(null);

export const useVillageData = () => {
  return useContext(VillageDataContext);
};

export const VillageDataProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [villageData, setVillageData] = useState<any | null>(null);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const username = localStorage.getItem("username");

    if (!username) {
      setError("Username not found. Please log in again.");
      return;
    }

    const fetchData = async () => {
      try {
        const data = await fetchVillageData(username);
        setVillageData(data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch village data. Please try again later.");
      }
    };

    fetchData();

    const intervalId = setInterval(fetchData, 5 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <VillageDataContext.Provider value={{ villageData, setVillageData, error }}>
      {children}
    </VillageDataContext.Provider>
  );
};
