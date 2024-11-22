import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL;

export const fetchFacts = async (topic, dateRange, reputable) => {
  try {
    const response = await axios.get(`${BASE_URL}/facts`, { 
      params: {
        topic: topic,
        date_range: dateRange,
        reputable: reputable,
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching facts:", error);
    throw error;
  }
};