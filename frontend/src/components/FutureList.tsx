import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  RefreshCw, 
  Search, 
  Grid, 
  List, 
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Calendar,
  DollarSign,
  Shield,
  BarChart3,
  Clock,
  XCircle
} from 'lucide-react';
import { toast } from 'react-hot-toast';

import { useFutureList } from '../hooks/useFutureList';
import { FutureDisplay, DEPOSIT_TYPE_LABELS, SETTLEMENT_METHOD_LABELS } from '../types/future';

type ViewMode = 'grid' | 'list';
type StatusFilter = 'all' | 'active' | 'upcoming' | 'expired' | 'matured';

// FutureCard component integrated directly
interface FutureCardProps {
  future: FutureDisplay;
  formatCurrency: (amount: number, currency?: string) => string;
  formatPercentage: (value: number) => string;
  formatDate: (dateString: string) => string;
  getFutureStatus: (future: FutureDisplay) => { status: string; label: string; color: string };
}

const FutureCard: React.FC<FutureCardProps> = ({
  future,
  formatCurrency,
  formatPercentage,
  formatDate,
  getFutureStatus
}) => {
  const status = getFutureStatus(future);
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'upcoming':
        return <Clock className="w-4 h-4 text-blue-600" />;
      case 'expired':
        return <AlertCircle className="w-4 h-4 text-orange-600" />;
      case 'matured':
        return <XCircle className="w-4 h-4 text-gray-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (color: string) => {
    switch (color) {
      case 'green':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'blue':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'orange':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'gray':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 overflow-hidden">
      {/* Header avec statut */}
      <div className="bg-gradient-to-r from-teal-50 to-blue-50 px-6 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 min-w-0 flex-1">
            <div className="p-2 bg-teal-100 rounded-lg flex-shrink-0">
              <BarChart3 className="w-5 h-5 text-teal-600" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-lg font-bold text-gray-900 truncate">{future.symbol}</h3>
              <p className="text-sm text-gray-600 truncate">{(future as any).fullName || future.description}</p>
            </div>
          </div>
          <div className={`flex items-center space-x-2 px-3 py-1 rounded-full border flex-shrink-0 ${getStatusColor(status.color)}`}>
            {getStatusIcon(status.status)}
            <span className="text-sm font-medium whitespace-nowrap">{status.label}</span>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="p-6 space-y-6">
        {/* Informations générales */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">ISIN: {future.isin}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Shield className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">Sous-jacent: {future.underlyingIdentifier}</span>
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-medium">Type:</span> {future.underlyingType}
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-sm text-gray-600">
              <span className="font-medium">Devise:</span> {future.tradingCurrency}
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-medium">Dépôt:</span> {DEPOSIT_TYPE_LABELS[future.depositType as keyof typeof DEPOSIT_TYPE_LABELS]}
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-medium">Règlement:</span> {SETTLEMENT_METHOD_LABELS[(future as any).settlementMethod as keyof typeof SETTLEMENT_METHOD_LABELS] || 'Non spécifié'}
            </div>
          </div>
        </div>

        {/* Dates importantes */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
            <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
            Dates importantes
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Première négociation:</span>
              <p className="font-medium text-gray-900 truncate">{formatDate(future.firstTradingDate)}</p>
            </div>
            <div>
              <span className="text-gray-600">Dernière négociation:</span>
              <p className="font-medium text-gray-900 truncate">{formatDate(future.lastTradingDate)}</p>
            </div>
            <div>
              <span className="text-gray-600">Échéance:</span>
              <p className="font-medium text-gray-900 truncate">{formatDate(future.maturityDate)}</p>
            </div>
          </div>
        </div>

        {/* Paramètres de trading */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
            <TrendingUp className="w-4 h-4 mr-2 flex-shrink-0" />
            Paramètres de trading
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Tick Size:</span>
              <p className="font-medium text-gray-900 truncate">{future.tickSize}</p>
            </div>
            <div>
              <span className="text-gray-600">Tick Value:</span>
              <p className="font-medium text-gray-900 truncate">{formatCurrency(future.tickValue)}</p>
            </div>
            <div>
              <span className="text-gray-600">Taille de lot:</span>
              <p className="font-medium text-gray-900 truncate">{future.lotSize.toLocaleString()}</p>
            </div>
            <div>
              <span className="text-gray-600">Multiplicateur:</span>
              <p className="font-medium text-gray-900 truncate">{future.contractMultiplier.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Calculs financiers - Section mise en valeur */}
        <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-lg p-6 border border-teal-100">
          <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <DollarSign className="w-5 h-5 mr-2 text-teal-600 flex-shrink-0" />
            Calculs financiers
          </h4>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Prix théorique */}
            <div className="bg-white rounded-lg p-4 shadow-sm border border-teal-100 min-w-0 overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Prix théorique</span>
                <TrendingUp className="w-4 h-4 text-teal-600 flex-shrink-0" />
              </div>
              <p className="text-lg md:text-xl font-bold text-teal-700 break-all" title={formatCurrency(future.theoreticalPrice)}>
                {formatCurrency(future.theoreticalPrice)}
              </p>
              <p className="text-xs text-gray-500 mt-1">Prix calculé du future</p>
            </div>

            {/* Valeur du contrat */}
            <div className="bg-white rounded-lg p-4 shadow-sm border border-blue-100 min-w-0 overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Valeur du contrat</span>
                <BarChart3 className="w-4 h-4 text-blue-600 flex-shrink-0" />
              </div>
              <p className="text-lg md:text-xl font-bold text-blue-700 break-all" title={formatCurrency(future.contractValue)}>
                {formatCurrency(future.contractValue)}
              </p>
              <p className="text-xs text-gray-500 mt-1">Valeur totale</p>
            </div>

            {/* Marge initiale */}
            <div className="bg-white rounded-lg p-4 shadow-sm border border-purple-100 min-w-0 overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Marge initiale</span>
                <Shield className="w-4 h-4 text-purple-600 flex-shrink-0" />
              </div>
              <p className="text-lg md:text-xl font-bold text-purple-700 break-all" title={formatCurrency(future.initialMarginAmount)}>
                {formatCurrency(future.initialMarginAmount)}
              </p>
              <p className="text-xs text-gray-500 mt-1 truncate">
                {formatPercentage(future.percentageMargin)} de marge
              </p>
            </div>
          </div>
        </div>

        {/* Statut de l'instrument */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <span className="text-sm font-medium text-gray-700">Statut de l'instrument:</span>
          <div className={`flex items-center space-x-2 px-3 py-1 rounded-full flex-shrink-0 ${
            future.instrumentStatus 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {future.instrumentStatus ? (
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
            ) : (
              <XCircle className="w-4 h-4 flex-shrink-0" />
            )}
            <span className="text-sm font-medium whitespace-nowrap">
              {future.instrumentStatus ? 'Côté' : 'Non côté'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const FutureList: React.FC = () => {
  const {
    futures,
    isLoading,
    error,
    lastUpdated,
    refreshFutures,
    formatCurrency,
    formatPercentage,
    formatDate,
    getFutureStatus
  } = useFutureList();

  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [sortBy, setSortBy] = useState<'symbol' | 'maturityDate' | 'theoreticalPrice' | 'contractValue'>('symbol');

  // Filtrer et trier les futures
  const filteredAndSortedFutures = futures
    .filter(future => {
      const matchesSearch = future.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           future.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           future.isin.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (statusFilter === 'all') return matchesSearch;
      
      const status = getFutureStatus(future);
      return matchesSearch && status.status === statusFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'symbol':
          return a.symbol.localeCompare(b.symbol);
        case 'maturityDate':
          return new Date(a.maturityDate).getTime() - new Date(b.maturityDate).getTime();
        case 'theoreticalPrice':
          return b.theoreticalPrice - a.theoreticalPrice;
        case 'contractValue':
          return b.contractValue - a.contractValue;
        default:
          return 0;
      }
    });

  // Statistiques
  const stats = {
    total: futures.length,
    active: futures.filter(f => getFutureStatus(f).status === 'active').length,
    upcoming: futures.filter(f => getFutureStatus(f).status === 'upcoming').length,
    expired: futures.filter(f => getFutureStatus(f).status === 'expired').length,
    matured: futures.filter(f => getFutureStatus(f).status === 'matured').length
  };

  const handleRefresh = async () => {
    const loadingToast = toast.loading('Actualisation des données...', {
      icon: '🔄',
    });
    
    try {
      await refreshFutures();
      toast.success('Données actualisées avec succès', {
        icon: '✅',
        duration: 3000,
      });
    } catch (error) {
      toast.error('Erreur lors de l\'actualisation', {
        icon: '❌',
        duration: 5000,
      });
    } finally {
      toast.dismiss(loadingToast);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-white py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Erreur de chargement</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={handleRefresh}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
            >
              Réessayer
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-white py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Portefeuille de Futures</h1>
              <p className="text-gray-600">
                {lastUpdated && `Dernière mise à jour: ${lastUpdated.toLocaleTimeString('fr-FR')}`}
              </p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="flex items-center space-x-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors duration-200 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Actualiser</span>
            </button>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-gray-400" />
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border border-green-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Actifs</p>
                  <p className="text-2xl font-bold text-green-600">{stats.active}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border border-blue-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">À venir</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.upcoming}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-blue-400" />
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border border-orange-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Expirés</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.expired}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-orange-400" />
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Échus</p>
                  <p className="text-2xl font-bold text-gray-600">{stats.matured}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Filtres et contrôles */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-6">
            {/* Recherche */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Rechercher par symbole, nom ou ISIN..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Filtres */}
            <div className="flex items-center space-x-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="all">Tous les statuts</option>
                <option value="active">Actifs</option>
                <option value="upcoming">À venir</option>
                <option value="expired">Expirés</option>
                <option value="matured">Échus</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="symbol">Trier par symbole</option>
                <option value="maturityDate">Trier par échéance</option>
                <option value="theoreticalPrice">Trier par prix théorique</option>
                <option value="contractValue">Trier par valeur contrat</option>
              </select>

              {/* Mode d'affichage */}
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-teal-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-teal-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Liste des futures */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center space-x-3">
              <RefreshCw className="w-6 h-6 animate-spin text-teal-600" />
              <span className="text-lg text-gray-600">Chargement des futures...</span>
            </div>
          </div>
        ) : filteredAndSortedFutures.length === 0 ? (
          <div className="text-center py-12">
            <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun future trouvé</h3>
            <p className="text-gray-600">
              {searchTerm || statusFilter !== 'all' 
                ? 'Aucun future ne correspond à vos critères de recherche.'
                : 'Aucun future n\'a encore été créé.'}
            </p>
          </div>
        ) : (
          <AnimatePresence>
            <motion.div
              className={viewMode === 'grid' 
                ? 'grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6' 
                : 'space-y-4'
              }
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {filteredAndSortedFutures.map((future) => (
                <motion.div
                  key={future.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <FutureCard
                    future={future}
                    formatCurrency={formatCurrency}
                    formatPercentage={formatPercentage}
                    formatDate={formatDate}
                    getFutureStatus={getFutureStatus}
                  />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};
