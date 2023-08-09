const VILLAGE_ENDPOINT = 'http://localhost:8080/villages/{account.username}/';

export const fetchVillageData = async () => {
  try {
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
