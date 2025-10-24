import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { SettlementMethod, DepositType, UnderlyingType } from '../../../../types/enums';

// Types for API responses
interface UnderlyingAsset {
  id: number;
  identifier: string;
}

interface APIState {
  settlementMethods: SettlementMethod[];
  depositTypes: DepositType[];
  underlyingTypes: UnderlyingType[];
  underlyingAssets: UnderlyingAsset[];
  isLoading: boolean;
  error: string | null;
}

export const useFutureAPI = () => {
  const [apiState, setApiState] = useState<APIState>({
    settlementMethods: [],
    depositTypes: [],
    underlyingTypes: [],
    underlyingAssets: [],
    isLoading: false,
    error: null
  });

  // Fetch all enum values on component mount
  useEffect(() => {
    const fetchEnums = async () => {
      setApiState(prev => ({ ...prev, isLoading: true, error: null }));
      
      try {
        const [settlementRes, depositRes, typeRes] = await Promise.all([
          axios.get<SettlementMethod[]>('/api/enums/settlement-methods'),
          axios.get<DepositType[]>('/api/enums/deposit-types'),
          axios.get<UnderlyingType[]>('/api/underlyings/types'),
        ]);

        setApiState(prev => ({
          ...prev,
          settlementMethods: settlementRes.data,
          depositTypes: depositRes.data,
          underlyingTypes: typeRes.data,
          isLoading: false
        }));
      } catch (error) {
        setApiState(prev => ({
          ...prev,
          error: 'Erreur lors du chargement des données',
          isLoading: false
        }));
        console.error('Error fetching enums:', error);
      }
    };

    fetchEnums();
  }, []);

  // Fetch underlying assets based on type
  const fetchUnderlyingAssets = useCallback(async (underlyingType: UnderlyingType) => {
    if (!underlyingType) {
      setApiState(prev => ({ ...prev, underlyingAssets: [] }));
      return;
    }

    try {
      const response = await axios.get<UnderlyingAsset[]>(`/api/underlying-assets?type=${underlyingType}`);
      setApiState(prev => ({ ...prev, underlyingAssets: response.data }));
    } catch (error) {
      setApiState(prev => ({ ...prev, underlyingAssets: [] }));
      console.error('Error fetching underlying assets:', error);
    }
  }, []);


  // Create future
  const createFuture = async (futureData: any) => {
    console.log('🚀 API: Starting future creation...');
    console.log('📤 API: Sending data:', futureData);
    console.log('🌐 API: URL:', '/api/futures');
    
    setApiState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      console.log('📡 API: Making POST request...');
      const response = await axios.post('/api/futures', futureData);
      console.log('✅ API: Response received:', response);
      console.log('📊 API: Response data:', response.data);
      
      setApiState(prev => ({ ...prev, isLoading: false }));
      return { success: true, data: response.data };
    } catch (error: any) {
      console.error('❌ API: Error occurred:', error);
      console.error('❌ API: Error response:', error.response);
      console.error('❌ API: Error status:', error.response?.status);
      console.error('❌ API: Error data:', error.response?.data);
      
      const errorMessage = error.response?.data?.message || 'Erreur lors de la création du future';
      setApiState(prev => ({ ...prev, error: errorMessage, isLoading: false }));
      return { success: false, error: errorMessage };
    }
  };

  return {
    ...apiState,
    fetchUnderlyingAssets,
    createFuture
  };
};
