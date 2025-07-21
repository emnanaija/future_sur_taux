import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ChevronRight, ChevronDown, Calendar, Info, DollarSign, TrendingUp, Settings, CheckCircle2, AlertCircle } from 'lucide-react';

interface FutureCreationDTO {
  symbol: string;
  description: string;
  isin: string;
  expirationCode: string;
  parentTicker: string;
  fullName: string;
  segment: string;
  maturityDate: string;
  firstTradingDate: string;
  lastTradingDate: string;
  initialMarginAmount: number;
  percentageMargin: number;
  lotSize: number;
  contractMultiplier: number;
  tradingCurrency: string;
  underlyingType: string;
  underlyingId: number;
  settlementMethod: string;
  instrumentStatus: boolean;
  tickSize: number;
  tickValue: number;
  depositType: string;
}

interface EnhancedInputProps {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  options?: string[];
  disabled?: boolean;
  readOnly?: boolean;
  icon?: React.ReactNode;
  description?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  value?: string | number;
}

export default function ImprovedFuturesForm() {
  // Form state
  const [form, setForm] = useState<FutureCreationDTO>({
    symbol: '',
    description: '',
    isin: '',
    expirationCode: '',
    parentTicker: '',
    fullName: '',
    segment: '',
    maturityDate: '',
    firstTradingDate: '',
    lastTradingDate: '',
    initialMarginAmount: 0,
    percentageMargin: 0,
    lotSize: 0,
    contractMultiplier: 0,
    tradingCurrency: '',
    underlyingType: '',
    underlyingId: 0,
    settlementMethod: '',
    instrumentStatus: true,
    tickSize: 0,
    tickValue: 0,
    depositType: '',
  });

  // UI states
  const [currentStep, setCurrentStep] = useState(0);
  const [expandedSections, setExpandedSections] = useState({});
  const [editMode, setEditMode] = useState<'tickValue' | 'contractMultiplier'>('tickValue');
  const [tickSizeStr, setTickSizeStr] = useState('');
  const [tickValueInput, setTickValueInput] = useState(0);
  const [contractMultiplierInput, setContractMultiplierInput] = useState(0);
  const [completedSections, setCompletedSections] = useState(new Set());
  const [formErrors, setFormErrors] = useState({});
  const [settlementMethods, setSettlementMethods] = useState<string[]>([]);
  const [depositTypes, setDepositTypes] = useState<string[]>([]);
  const [underlyingTypes, setUnderlyingTypes] = useState<string[]>([]);
  const [underlyingAssets, setUnderlyingAssets] = useState<{ id: number; identifier: string }[]>([]);

  // Fetch enums
  useEffect(() => {
    async function fetchEnums() {
      try {
        const [settlementRes, depositRes, typeRes] = await Promise.all([
          axios.get<string[]>('/api/enums/settlement-methods'),
          axios.get<string[]>('/api/enums/deposit-types'),
          axios.get<string[]>('/api/underlyings/types'),
        ]);
        setSettlementMethods(settlementRes.data);
        setDepositTypes(depositRes.data);
        setUnderlyingTypes(typeRes.data);
      } catch (err) {
        console.error('Error fetching enums:', err);
      }
    }
    fetchEnums();
  }, []);

  // Fetch underlying assets based on underlyingType
  useEffect(() => {
    if (form.underlyingType) {
      axios.get<{ id: number; identifier: string }[]>(`/api/underlying-assets?type=${form.underlyingType}`)
        .then(res => setUnderlyingAssets(res.data))
        .catch(() => setUnderlyingAssets([]));
      setForm(prev => ({ ...prev, underlyingId: 0 }));
    } else {
      setUnderlyingAssets([]);
      setForm(prev => ({ ...prev, underlyingId: 0 }));
    }
  }, [form.underlyingType]);

  // Update tickSizeStr when tickSize changes
  useEffect(() => {
    setTickSizeStr(form.tickSize > 0 ? form.tickSize.toString() : '');
  }, [form.tickSize]);

  // Handle tick size, tick value, and contract multiplier calculations
  useEffect(() => {
    const tickSize = parseTickSize(tickSizeStr);
    if (editMode === 'tickValue') {
      const contractMultiplierCalc = tickSize > 0 ? tickValueInput / tickSize : 0;
      setForm(prev => {
        if (
          prev.tickSize !== tickSize ||
          prev.tickValue !== tickValueInput ||
          prev.contractMultiplier !== contractMultiplierCalc
        ) {
          return {
            ...prev,
            tickSize,
            tickValue: tickValueInput,
            contractMultiplier: contractMultiplierCalc,
          };
        }
        return prev;
      });
      setContractMultiplierInput(contractMultiplierCalc);
    } else {
      const tickValueCalc = contractMultiplierInput * tickSize;
      setForm(prev => {
        if (
          prev.tickSize !== tickSize ||
          prev.contractMultiplier !== contractMultiplierInput ||
          prev.tickValue !== tickValueCalc
        ) {
          return {
            ...prev,
            tickSize,
            contractMultiplier: contractMultiplierInput,
            tickValue: tickValueCalc,
          };
        }
        return prev;
      });
      setTickValueInput(tickValueCalc);
    }
  }, [tickSizeStr, editMode, tickValueInput, contractMultiplierInput]);

  // Handle margin calculations based on depositType
  const isRate = form.depositType === 'RATE';
  const isAmount = form.depositType === 'AMOUNT';
  useEffect(() => {
    setForm(prev => {
      if (isRate) {
        return { ...prev, initialMarginAmount: prev.lotSize * prev.percentageMargin };
      } else if (isAmount) {
        return { ...prev, percentageMargin: prev.lotSize > 0 ? prev.initialMarginAmount / prev.lotSize : 0 };
      }
      return prev;
    });
  }, [form.lotSize, form.depositType]);

  // Form sections configuration
  const formSections = [
    {
      id: 'identification',
      title: 'Identification de l\'instrument',
      icon: <Info className="w-5 h-5" />,
      fields: ['symbol', 'isin', 'description', 'fullName'],
      description: 'Informations de base de l\'instrument financier'
    },
    {
      id: 'details',
      title: 'Détails & Configuration',
      icon: <Settings className="w-5 h-5" />,
      fields: ['expirationCode', 'parentTicker', 'segment', 'maturityDate'],
      description: 'Configuration avancée et dates importantes'
    },
    {
      id: 'deposit',
      title: 'Dépôt & Marge',
      icon: <DollarSign className="w-5 h-5" />,
      fields: ['depositType', 'lotSize', 'initialMarginAmount', 'percentageMargin'],
      description: 'Gestion des marges et tailles de lot'
    },
    {
      id: 'underlying',
      title: 'Sous-jacents',
      icon: <TrendingUp className="w-5 h-5" />,
      fields: ['underlyingType', 'underlyingId'],
      description: 'Configuration des actifs sous-jacents'
    },
    {
      id: 'trading',
      title: 'Négociation',
      icon: <Calendar className="w-5 h-5" />,
      fields: ['firstTradingDate', 'lastTradingDate', 'tradingCurrency', 'tickSize', 'tickValue', 'contractMultiplier', 'settlementMethod'],
      description: 'Paramètres de trading et cotation'
    }
  ];

  // Validation logic
  const validateSection = (sectionId: string) => {
    const section = formSections.find(s => s.id === sectionId);
    const requiredFields = section.fields;
    const errors = {};

    requiredFields.forEach(field => {
      if (!form[field] || (typeof form[field] === 'string' && form[field].trim() === '') || (typeof form[field] === 'number' && form[field] === 0)) {
        if (['symbol', 'description', 'underlyingType'].includes(field)) {
          errors[field] = 'Ce champ est requis';
        }
      }
    });

    setFormErrors(prev => ({ ...prev, ...errors }));
    return Object.keys(errors).length === 0;
  };

  // Handlers
  const parseTickSize = (str: string): number => {
    if (!str) return 0;
    const val = parseFloat(str);
    return isNaN(val) ? 0 : val;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (type === 'number' ? parseFloat(value) || 0 : value)
    }));

    if (formErrors[name] && value.trim()) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handlePercentageMarginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value) || 0;
    setForm(prev => ({ ...prev, percentageMargin: val, initialMarginAmount: prev.lotSize * val }));
  };

  const handleInitialMarginAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value) || 0;
    setForm(prev => ({ ...prev, initialMarginAmount: val, percentageMargin: prev.lotSize > 0 ? val / prev.lotSize : 0 }));
  };

  const handleTickSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTickSizeStr(e.target.value);
  };

  const handleTickValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value) || 0;
    setTickValueInput(val);
  };

  const handleContractMultiplierChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value) || 0;
    setContractMultiplierInput(val);
  };

  const handleModeChange = (mode: 'tickValue' | 'contractMultiplier') => {
    setEditMode(mode);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/api/futures', form);
      alert('Future créé avec succès');
    } catch (err) {
      alert('Erreur lors de la création');
      console.error(err);
    }
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const nextStep = () => {
    if (currentStep < formSections.length - 1) {
      if (validateSection(formSections[currentStep].id)) {
        setCompletedSections(prev => new Set([...prev, formSections[currentStep].id]));
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (stepIndex: number) => {
    setCurrentStep(stepIndex);
  };

  // Progress Indicator Component
  const ProgressIndicator = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        {formSections.map((section, index) => (
          <div
            key={section.id}
            className={`flex items-center cursor-pointer transition-all duration-200 ${
              index <= currentStep ? 'text-blue-600' : 'text-gray-400'
            }`}
            onClick={() => goToStep(index)}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 transition-all duration-200 ${
              completedSections.has(section.id) 
                ? 'bg-green-500 text-white' 
                : index === currentStep 
                  ? 'bg-blue-600 text-white' 
                  : index < currentStep 
                    ? 'bg-blue-200 text-blue-600' 
                    : 'bg-gray-200 text-gray-400'
            }`}>
              {completedSections.has(section.id) ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                <span className="text-sm font-semibold">{index + 1}</span>
              )}
            </div>
            <span className="hidden sm:block text-sm font-medium">{section.title}</span>
          </div>
        ))}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${((currentStep + 1) / formSections.length) * 100}%` }}
        ></div>
      </div>
    </div>
  );

  // Enhanced Input Component
  const EnhancedInput: React.FC<EnhancedInputProps> = ({ label, name, type = 'text', required = false, placeholder, options, disabled = false, readOnly = false, icon, description, onChange, value }) => (
    <div className="space-y-2">
      <label htmlFor={name} className="flex items-center text-sm font-semibold text-gray-700">
        {icon && <span className="mr-2">{icon}</span>}
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {description && <p className="text-xs text-gray-500">{description}</p>}
      
      {type === 'select' ? (
        <select
          id={name}
          name={name}
          value={value !== undefined ? value : form[name]}
          onChange={onChange || handleChange}
          disabled={disabled}
          className={`w-full p-3 border rounded-lg transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            formErrors[name] ? 'border-red-500 bg-red-50' : 'border-gray-300'
          } ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'hover:border-gray-400'}`}
        >
          <option value="">Sélectionnez une option</option>
          {options?.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          value={value !== undefined ? value : form[name]}
          onChange={onChange || handleChange}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          className={`w-full p-3 border rounded-lg transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            formErrors[name] ? 'border-red-500 bg-red-50' : 'border-gray-300'
          } ${disabled || readOnly ? 'bg-gray-100 cursor-not-allowed' : 'hover:border-gray-400'}`}
        />
      )}
      
      {formErrors[name] && (
        <div className="flex items-center text-red-600 text-sm">
          <AlertCircle className="w-4 h-4 mr-1" />
          {formErrors[name]}
        </div>
      )}
    </div>
  );

  // Render current section
  const renderCurrentSection = () => {
    const section = formSections[currentStep];
    
    switch (section.id) {
      case 'identification':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <EnhancedInput
                label="Symbole"
                name="symbol"
                required
                placeholder="Ex: AAPL2024"
                description="Identifiant unique de l'instrument"
              />
              <EnhancedInput
                label="Code ISIN"
                name="isin"
                placeholder="Ex: US0378331005"
                description="Code d'identification international"
              />
              <EnhancedInput
                label="Description"
                name="description"
                required
                placeholder="Description courte de l'instrument"
                description="Résumé en quelques mots"
              />
              <EnhancedInput
                label="Nom complet"
                name="fullName"
                placeholder="Nom complet de l'instrument"
                description="Dénomination officielle complète"
              />
            </div>
          </div>
        );

      case 'details':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <EnhancedInput
                label="Code d'expiration"
                name="expirationCode"
                placeholder="Ex: 202412"
                description="Code identifiant la période d'expiration"
              />
              <EnhancedInput
                label="Ticker parent"
                name="parentTicker"
                placeholder="Ex: AAPL"
                description="Symbole de l'actif sous-jacent principal"
              />
              <EnhancedInput
                label="Segment"
                name="segment"
                placeholder="Ex: Equity Futures"
                description="Catégorie de marché"
              />
              <EnhancedInput
                label="Date d'échéance"
                name="maturityDate"
                type="date"
                icon={<Calendar className="w-4 h-4" />}
                description="Date de fin de vie de l'instrument"
              />
            </div>
          </div>
        );

      case 'deposit':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <EnhancedInput
                label="Type de dépôt"
                name="depositType"
                type="select"
                options={depositTypes}
                required
                description="Mode de garantie requis"
              />
              <EnhancedInput
                label="Taille de lot"
                name="lotSize"
                type="number"
                placeholder="Ex: 100"
                description="Nombre d'unités par lot"
              />
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-4">Configuration des marges</h4>
              <div className="flex space-x-2 mb-4">
                <button
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, depositType: 'AMOUNT' }))}
                  className={`flex-1 p-2 rounded-lg font-medium transition-all ${
                    isAmount ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 border border-blue-600'
                  }`}
                >
                  Montant fixe
                </button>
                <button
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, depositType: 'RATE' }))}
                  className={`flex-1 p-2 rounded-lg font-medium transition-all ${
                    isRate ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 border border-blue-600'
                  }`}
                >
                  Pourcentage
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <EnhancedInput
                  label="Montant de la marge initiale"
                  name="initialMarginAmount"
                  type="number"
                  placeholder="Ex: 5000"
                  readOnly={!isAmount}
                  icon={<DollarSign className="w-4 h-4" />}
                  onChange={handleInitialMarginAmountChange}
                  value={form.initialMarginAmount}
                />
                <EnhancedInput
                  label="Pourcentage de marge"
                  name="percentageMargin"
                  type="number"
                  placeholder="Ex: 10"
                  readOnly={!isRate}
                  onChange={handlePercentageMarginChange}
                  value={form.percentageMargin}
                />
              </div>
            </div>
          </div>
        );

      case 'underlying':
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                Configuration des sous-jacents
              </h4>
              <div className="space-y-4">
                <EnhancedInput
                  label="Type du sous-jacent"
                  name="underlyingType"
                  type="select"
                  options={underlyingTypes}
                  required
                  description="Catégorie de l'actif sous-jacent"
                />
                <EnhancedInput
                  label="Sous-jacent"
                  name="underlyingId"
                  type="select"
                  options={underlyingAssets.map(asset => asset.identifier)}
                  disabled={!form.underlyingType}
                  description="Actif spécifique servant de référence"
                />
              </div>
            </div>
          </div>
        );

      case 'trading':
        return (
          <div className="space-y-8">
            {/* Trading Dates */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                Dates de négociation
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <EnhancedInput
                  label="Première négociation"
                  name="firstTradingDate"
                  type="date"
                />
                <EnhancedInput
                  label="Dernière négociation"
                  name="lastTradingDate"
                  type="date"
                />
                <EnhancedInput
                  label="Devise de négociation"
                  name="tradingCurrency"
                  placeholder="Ex: EUR, USD"
                />
              </div>
            </div>

            {/* Tick Configuration */}
            <div className="bg-yellow-50 p-6 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-4">Configuration des ticks et multiplicateurs</h4>
              
              <div className="flex space-x-2 mb-6">
                <button
                  type="button"
                  onClick={() => handleModeChange('tickValue')}
                  className={`flex-1 p-3 rounded-lg font-medium transition-all ${
                    editMode === 'tickValue' ? 'bg-yellow-600 text-white' : 'bg-white text-yellow-700 border border-yellow-600'
                  }`}
                >
                  Mode Tick Value
                </button>
                <button
                  type="button"
                  onClick={() => handleModeChange('contractMultiplier')}
                  className={`flex-1 p-3 rounded-lg font-medium transition-all ${
                    editMode === 'contractMultiplier' ? 'bg-yellow-600 text-white' : 'bg-white text-yellow-700 border border-yellow-600'
                  }`}
                >
                  Mode Multiplicateur
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <EnhancedInput
                  label="Tick Size"
                  name="tickSize"
                  value={tickSizeStr}
                  onChange={handleTickSizeChange}
                  placeholder="Ex: 0.01"
                  description="Plus petit mouvement de prix"
                />
                <EnhancedInput
                  label={`Tick Value ${editMode === 'tickValue' ? '' : '(calculé)'}`}
                  name="tickValue"
                  type="number"
                  value={editMode === 'tickValue' ? tickValueInput : form.tickValue}
                  onChange={handleTickValueChange}
                  readOnly={editMode !== 'tickValue'}
                  placeholder="Ex: 12.50"
                />
                <EnhancedInput
                  label={`Multiplicateur ${editMode === 'contractMultiplier' ? '' : '(calculé)'}`}
                  name="contractMultiplier"
                  type="number"
                  value={editMode === 'contractMultiplier' ? contractMultiplierInput : form.contractMultiplier}
                  onChange={handleContractMultiplierChange}
                  readOnly={editMode !== 'contractMultiplier'}
                  placeholder="Ex: 1000"
                />
              </div>
            </div>

            {/* Settlement and Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-800">Mode de livraison</h4>
                <EnhancedInput
                  label="Méthode de règlement"
                  name="settlementMethod"
                  type="select"
                  options={settlementMethods}
                  description="Type de dénouement à l'échéance"
                />
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-gray-800">Statut de cotation</h4>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => setForm(prev => ({ ...prev, instrumentStatus: true }))}
                    className={`flex-1 p-3 rounded-lg font-semibold transition-all ${
                      form.instrumentStatus 
                        ? 'bg-green-600 text-white shadow-lg' 
                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                    }`}
                  >
                    ✓ Côté
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm(prev => ({ ...prev, instrumentStatus: false }))}
                    className={`flex-1 p-3 rounded-lg font-semibold transition-all ${
                      !form.instrumentStatus 
                        ? 'bg-red-600 text-white shadow-lg' 
                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                    }`}
                  >
                    ✗ Non côté
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Création d'un Future</h1>
          <p className="text-gray-600">Configurez votre instrument financier en quelques étapes simples</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <ProgressIndicator />

          {/* Current Section */}
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
            <div className="flex items-center mb-6">
              <div className="p-3 bg-blue-100 rounded-lg mr-4">
                {formSections[currentStep].icon}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{formSections[currentStep].title}</h2>
                <p className="text-gray-600">{formSections[currentStep].description}</p>
              </div>
            </div>

            {renderCurrentSection()}
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 0}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                currentStep === 0 
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                  : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
              }`}
            >
              ← Précédent
            </button>

            <div className="text-sm text-gray-500">
              Étape {currentStep + 1} sur {formSections.length}
            </div>

            {currentStep === formSections.length - 1 ? (
              <button
                type="submit"
                className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Créer le Future
              </button>
            ) : (
              <button
                type="button"
                onClick={nextStep}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Suivant →
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
