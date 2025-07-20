import axios from 'axios';

const API_BASE_URL = '/api/underlyings';

export const getUnderlyingTypes = async (): Promise<string[]> => {
  try {
    const response = await axios.get<string[]>(`${API_BASE_URL}/types`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des UnderlyingTypes:', error);
    throw error;
  }
};
