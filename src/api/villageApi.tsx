

export const fetchVillageData = async (username: string) => {
  try {
    const VILLAGE_ENDPOINT = `http://localhost:8080/villages/${username}/`;

    const response = await fetch(VILLAGE_ENDPOINT);
    if (!response.ok) {
      throw new Error('Failed to fetch village data.');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching village data:", error);
    throw error;
  }
};
