import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { FutureDisplay } from '../types/future';

interface FutureListState {
  futures: FutureDisplay[];
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

export const useFutureList = () => {
  const [state, setState] = useState<FutureListState>({
    futures: [],
    isLoading: false,
    error: null,
    lastUpdated: null
  });

  // Charger la liste des futures
  const fetchFutures = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      console.log('🔄 Chargement de la liste des futures...');
      const response = await axios.get<FutureDisplay[]>('/api/futures/display');
      console.log('✅ Futures chargés:', response.data);
      
      setState(prev => ({
        ...prev,
        futures: response.data,
        isLoading: false,
        lastUpdated: new Date()
      }));
    } catch (error: any) {
      console.error('❌ Erreur lors du chargement des futures:', error);
      setState(prev => ({
        ...prev,
        error: error.response?.data?.message || 'Erreur lors du chargement des futures',
        isLoading: false
      }));
    }
  }, []);

  // Charger les futures au montage du composant
  useEffect(() => {
    fetchFutures();
  }, [fetchFutures]);

  // Rafraîchir la liste
  const refreshFutures = useCallback(() => {
    fetchFutures();
  }, [fetchFutures]);


  // Formater les montants pour l'affichage
  const formatCurrency = useCallback((amount: number, currency: string = 'EUR') => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 6
    }).format(amount);
  }, []);

  // Formater les pourcentages
  const formatPercentage = useCallback((value: number) => {
    return `${value.toFixed(2)}%`;
  }, []);

  // Formater les dates
  const formatDate = useCallback((dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  }, []);

  // Calculer le statut du future
  const getFutureStatus = useCallback((future: FutureDisplay) => {
    const today = new Date();
    const maturityDate = new Date(future.maturityDate);
    const firstTradingDate = new Date(future.firstTradingDate);
    const lastTradingDate = new Date(future.lastTradingDate);

    if (today < firstTradingDate) {
      return { status: 'upcoming', label: 'À venir', color: 'blue' };
    } else if (today >= firstTradingDate && today <= lastTradingDate) {
      return { status: 'active', label: 'Actif', color: 'green' };
    } else if (today > lastTradingDate && today <= maturityDate) {
      return { status: 'expired', label: 'Expiré', color: 'orange' };
    } else {
      return { status: 'matured', label: 'Échu', color: 'gray' };
    }
  }, []);

  return {
    ...state,
    fetchFutures,
    refreshFutures,
    formatCurrency,
    formatPercentage,
    formatDate,
    getFutureStatus
  };
};
