export const fetchVillageData = async (username: string) => {
  try {
    const VILLAGE_ENDPOINT = `http://localhost:8080/villages/${username}/`;

    const response = await fetch(VILLAGE_ENDPOINT);
    if (!response.ok) {
      throw new Error("Failed to fetch village data.");
    }
    const data = await response.json();
    console.log(data);

    return data;
  } catch (error) {
    console.error("Error fetching village data:", error);
    throw error;
  }
};

export const updateVillageNameApi = async (
  username: string,
  newName: string
) => {
  const isValidVillageName = (newName: string) => {
    if (newName.length < 1 || newName.length > 20) {
      alert("Village name must be between 1 and 20 characters.");
      return false;
    }

    const regex = /^[a-zA-Z0-9 _-]+$/;
    if (!regex.test(newName)) {
      alert(
        "Village name can only contain alphanumeric characters, spaces, underscores, and hyphens."
      );
      return false;
    }

    return true;
  };

  if (isValidVillageName(newName)) {
    const response = await fetch(
      `http://localhost:8080/villages/update-name/${username}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newName),
      }
    );

    if (response.ok) {
      alert("name changed sucessfully!");
      window.location.reload();
      return true;
    }
  } else {
    alert("Failed to update village name");
    window.location.reload();
  }
};

export const upgradeBuildingApi = async (buildingId: number) => {
  const BASE_URL = "http://localhost:8080/"; // endpoint
  let username = localStorage.getItem("username");
  const response = await fetch(
    `${BASE_URL}${username}/buildings/${buildingId}/upgrade`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to upgrade building.");
  }
  return await response.json();
};

export const fetchSurroundingVillages = async (
  x: number,
  y: number
): Promise<any[]> => {
  try {
    const response = await fetch(
      `http://localhost:8080/villages/surrounding?x=${x}&y=${y}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch surrounding villages. Status: ${response.status}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("API call to fetch surrounding villages failed:", error);
    throw error;
  }
};

export const trainTroops = async (
  villageId: string,
  troopType: string,
  quantity: number
) => {
  const response = await fetch(
    `http://localhost:8080/troops/train/${villageId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        troopType,
        quantity,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  return response.json();
};

export interface TroopTypeDTO {
  name: string;
  health: number;
  armor: number;
  attack: number;
  carryCapacity: number;
  trainingTime: number;
  resourcesRequired: Record<string, number>;
  description: string;
}

export const fetchAllTroopTypes = async (
  buildingId: number
): Promise<TroopTypeDTO[]> => {
  try {
    const response = await fetch(
      `http://localhost:8080/troops/${buildingId}/list`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch troop types. Status: ${response.status}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("API call to fetch troop types failed:", error);
    throw error;
  }
};

export const fetchAvailableTroops = async (buildingId: number) => {
  try {
    console.log(buildingId + "!!!!!!!!");
    const response = await fetch(
      `http://localhost:8080/troops/${buildingId}/list`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch troops:", error);
    throw error;
  }
};
