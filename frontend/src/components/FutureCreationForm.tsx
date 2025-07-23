import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ChevronRight, ChevronDown, Calendar, Info, DollarSign, TrendingUp, Settings, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
  lastTraadingDate: string;
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

// Ajouter l'interface pour les sections
interface FormSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  fields: (keyof FutureCreationDTO)[];
}

// Ajouter l'interface pour les erreurs
interface FormErrors {
  [key: string]: string;
}

const FutureCreationForm: React.FC = () => {
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
    lastTraadingDate: '',
    initialMarginAmount: 0,
    percentageMargin: 0,
    lotSize: 0,
    contractMultiplier: 0,
    tradingCurrency: '',
    underlyingType: '',
    underlyingId: 0,
    settlementMethod: '',
    instrumentStatus: false,
    tickSize: 0,
    tickValue: 0,
    depositType: '',
  });
const [currentStep, setCurrentStep] = useState(0);
  const [expandedSections, setExpandedSections] = useState({});
  const [settlementMethods, setSettlementMethods] = useState<string[]>([]);
  const [depositTypes, setDepositTypes] = useState<string[]>([]);
  const [underlyingTypes, setUnderlyingTypes] = useState<string[]>([]);
  const [underlyingAssets, setUnderlyingAssets] = useState<{ id: number; identifier: string }[]>([]);

  const [editMode, setEditMode] = useState<'tickValue' | 'contractMultiplier'>('tickValue');
  const [tickSizeStr, setTickSizeStr] = useState('');
  const [percentageMarginStr, setPercentageMarginStr] = useState('');

  const [tickValueInput, setTickValueInput] = useState(0);
  const [contractMultiplierInput, setContractMultiplierInput] = useState(0);
const [completedSections, setCompletedSections] = useState(new Set());
  // Définir correctement formErrors avec son type
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [justArrivedOnLastStep, setJustArrivedOnLastStep] = useState(false);
  useEffect(() => {
    async function fetchEnums() {
      const [settlementRes, depositRes, typeRes] = await Promise.all([
        axios.get<string[]>('/api/enums/settlement-methods'),
        axios.get<string[]>('/api/enums/deposit-types'),
        axios.get<string[]>('/api/underlyings/types'),
      ]);
      setSettlementMethods(settlementRes.data);
      setDepositTypes(depositRes.data);
      setUnderlyingTypes(typeRes.data);
    }
    fetchEnums();
  }, []);

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

  useEffect(() => {
    setTickSizeStr(form.tickSize > 0 ? form.tickSize.toString() : '');
  }, [form.tickSize]);
useEffect(() => {
  setPercentageMarginStr(form.percentageMargin > 0 ? form.percentageMargin.toString() : '');
}, [form.percentageMargin]);

useEffect(() => {
  const tickSize = parseTickSize(tickSizeStr);
  if (editMode === 'tickValue') {
    const contractMultiplierCalc = tickSize > 0 ? tickValueInput / tickSize : 0;

    // Met à jour form seulement si les valeurs ont changé
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

    // Pour l'affichage local, on peut mettre à jour contractMultiplierInput pour rester cohérent
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

    // Mettre à jour tickValueInput local pour affichage
    setTickValueInput(tickValueCalc);
  }
}, [tickSizeStr, editMode, tickValueInput, contractMultiplierInput]);

const parsePercentageMargin = (str: string): number => {
  if (!str) return 0;
  const val = parseFloat(str);
  return isNaN(val) ? 0 : val;
};

  const parseTickSize = (str: string): number => {
    if (!str) return 0;
    const val = parseFloat(str);
    return isNaN(val) ? 0 : val;
  };

  const isRate = form.depositType === 'RATE';
  const isAmount = form.depositType === 'AMOUNT';

  // Corriger le handler pour les checkboxes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handlePercentageMarginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setForm(prev => ({ ...prev, percentageMargin: val, initialMarginAmount: prev.lotSize * val }));
  };

  const handleInitialMarginAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setForm(prev => ({ ...prev, initialMarginAmount: val, percentageMargin: prev.lotSize > 0 ? val / prev.lotSize : 0 }));
  };

  const handleTickValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setTickValueInput(val);
  };

  const handleContractMultiplierChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setContractMultiplierInput(val);
  };

  const handleTickSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTickSizeStr(e.target.value);
  };
  const handlePercentageMarginInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const str = e.target.value;
  setPercentageMarginStr(str);
  const val = parsePercentageMargin(str);
  setForm(prev => ({
    ...prev,
    percentageMargin: val,
    initialMarginAmount: prev.lotSize * val
  }));
};


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

  const handleModeChange = (mode: 'tickValue' | 'contractMultiplier') => {
    setEditMode(mode);
  };

  // Ajouter un état pour la validation globale
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fonction de validation complète
  const validateForm = (): boolean => {
    const errors: { [key: string]: string } = {};

    // Validation des champs obligatoires
    if (!form.symbol) errors.symbol = 'Le symbole est requis';
    if (!form.underlyingType) errors.underlyingType = 'Le type de sous-jacent est requis';
    if (!form.underlyingId) errors.underlyingId = 'Le sous-jacent est requis';
    if (!form.depositType) errors.depositType = 'Le type de dépôt est requis';
    if (!form.lotSize) errors.lotSize = 'La taille de lot est requise';
    if (!form.tickSize) errors.tickSize = 'Le tick size est requis';
    if (!form.firstTradingDate) errors.firstTradingDate = 'La date de première négociation est requise';
    if (!form.lastTraadingDate) errors.lastTraadingDate = 'La date de dernière négociation est requise';
    if (!form.tradingCurrency) errors.tradingCurrency = 'La devise de négociation est requise';
    if (!form.settlementMethod) errors.settlementMethod = 'La méthode de règlement est requise';

    // Validation des valeurs numériques
    if (form.tickSize <= 0) errors.tickSize = 'Le tick size doit être supérieur à 0';
    if (form.lotSize <= 0) errors.lotSize = 'La taille de lot doit être supérieure à 0';

    // Mise à jour des erreurs
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Modifier le handleSubmit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Empêcher la soumission si on n'est pas sur la dernière étape
    if (currentStep !== formSections.length - 1) {
      return;
    }
    // Empêcher la double soumission
    if (isSubmitting) return;
    
    // Valider le formulaire
    if (!validateForm()) {
      alert('Veuillez corriger les erreurs avant de soumettre le formulaire');
      return;
    }

    try {
      setIsSubmitting(true);
      await axios.post('/api/futures', form);
      alert('Future créé avec succès');
      // Optionnel : rediriger ou réinitialiser le formulaire
    } catch (err) {
      alert('Erreur lors de la création. Veuillez vérifier les données et réessayer.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };
  const [initialMarginAmountStr, setInitialMarginAmountStr] = useState('');

useEffect(() => {
  setInitialMarginAmountStr(form.initialMarginAmount > 0 ? form.initialMarginAmount.toString() : '');
}, [form.initialMarginAmount]);

const parseInitialMarginAmount = (str: string): number => {
  if (!str) return 0;
  const val = parseFloat(str);
  return isNaN(val) ? 0 : val;
};

const handleInitialMarginAmountInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const str = e.target.value;
  setInitialMarginAmountStr(str);
  const val = parseInitialMarginAmount(str);
  setForm(prev => ({
    ...prev,
    initialMarginAmount: val,
    percentageMargin: prev.lotSize > 0 ? val / prev.lotSize : 0,
  }));
};


  // Définir les sections avec leurs champs requis
  const formSections: FormSection[] = [
    {
      id: 'identification',
      title: "Identification de l'instrument",
      icon: <Info className="w-5 h-5" />,
      description: "Informations de base",
      fields: ['symbol', 'description', 'isin', 'fullName']
    },
    {
      id: 'deposit',
      title: "Dépôt & Marges",
      icon: <DollarSign className="w-5 h-5" />,
      description: "Configuration des marges",
      fields: ['depositType', 'lotSize', 'initialMarginAmount', 'percentageMargin']
    },
    {
      id: 'underlying',
      title: "Sous-jacents",
      icon: <TrendingUp className="w-5 h-5" />,
      description: "Définition du sous-jacent",
      fields: ['underlyingType', 'underlyingId']
    },
    {
      id: 'trading',
      title: "Négociation",
      icon: <Calendar className="w-5 h-5" />,
      description: "Paramètres de trading",
      fields: ['firstTradingDate', 'lastTraadingDate', 'tradingCurrency', 'tickSize', 'settlementMethod']
    }
  ];

  // Ajouter l'état pour la navigation
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  // Fonctions de navigation
  // Améliorer la fonction de validation des étapes
  const validateStep = (stepIndex: number): boolean => {
    const section = formSections[stepIndex];
    const errors: FormErrors = {};

    section.fields.forEach(field => {
      const value = form[field];
      if (value === undefined || value === '' || value === 0) {
        errors[field] = `Le champ ${field} est requis`;
      }

      // Validations spécifiques par champ
      switch (field) {
        case 'tickSize':
          if (parseFloat(String(value)) <= 0) {
            errors[field] = 'Le tick size doit être supérieur à 0';
          }
          break;
        case 'lotSize':
          if (parseFloat(String(value)) <= 0) {
            errors[field] = 'La taille de lot doit être supérieure à 0';
          }
          break;
        // Ajouter d'autres validations spécifiques si nécessaire
      }
    });

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Modifier la fonction nextStep pour valider uniquement l'étape courante et effacer les erreurs des autres étapes
  const nextStep = () => {
    if (currentStep < formSections.length - 1) {
      const section = formSections[currentStep];
      const errors: FormErrors = {};
      section.fields.forEach(field => {
        const value = form[field];
        if (value === undefined || value === '' || value === 0) {
          errors[field] = `Le champ ${field} est requis`;
        }
        // Validations spécifiques
        switch (field) {
          case 'tickSize':
            if (parseFloat(String(value)) <= 0) {
              errors[field] = 'Le tick size doit être supérieur à 0';
            }
            break;
          case 'lotSize':
            if (parseFloat(String(value)) <= 0) {
              errors[field] = 'La taille de lot doit être supérieure à 0';
            }
            break;
        }
      });
      setFormErrors(errors); // On ne garde que les erreurs de l'étape courante
      if (Object.keys(errors).length === 0) {
        setCompletedSteps(prev => new Set(prev).add(currentStep));
        setCurrentStep(prev => prev + 1);
        if (currentStep === formSections.length - 2) {
          setJustArrivedOnLastStep(true);
        }
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  // Ajouter des animations pour les transitions
  const pageTransition = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 }
  };

  // Ajouter un composant pour les tooltips
  const Tooltip = ({ children }: { children: React.ReactNode }) => (
    <div className="absolute -top-8 left-0 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
      {children}
    </div>
  );

  // Modifier le rendu des sections pour inclure les animations
  const renderStepContent = () => {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={pageTransition}
          transition={{ duration: 0.3 }}
          className="min-h-[400px]"
        >
          {/* Contenu des sections avec UX améliorée */}
          {currentStep === 0 && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Champ Symbol avec tooltip et validation */}
                <div className="group relative">
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                    Code valeur <span className="text-red-500 ml-1">*</span>
                    <div className="relative ml-2">
                      <Info className="w-4 h-4 text-gray-400 cursor-help" />
                      <Tooltip>
                        Identifiant unique de l'instrument financier
                      </Tooltip>
                    </div>
                  </label>
                  <input
                    name="symbol"
                    value={form.symbol}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg transition-all duration-200
                             focus:ring-2 focus:ring-teal-500 focus:border-transparent
                             hover:border-gray-400"
                    required
                  />
                  {/* Validation en temps réel */}
                  <AnimatePresence>
                    {formErrors.symbol && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-red-500 text-sm flex items-center mt-1"
                      >
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {formErrors.symbol}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
                
                {/* Répéter pour les autres champs avec le même style */}
                <div className="space-y-2">
                  <label htmlFor="isin" className="block text-sm font-semibold text-gray-700">
                    Code ISIN
                  </label>
                  <input
                    id="isin"
                    name="isin"
                    value={form.isin}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-200"
                  />
                  {formErrors.isin && (
                    <p className="text-red-500 text-xs mt-1 flex items-center"><AlertCircle className="w-4 h-4 mr-1" />{formErrors.isin}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label htmlFor="expirationCode" className="block text-sm font-semibold text-gray-700">
                    Code d'expiration
                  </label>
                  <input
                    id="expirationCode"
                    name="expirationCode"
                    value={form.expirationCode}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-200"
                  />
                  {formErrors.expirationCode && (
                    <p className="text-red-500 text-xs mt-1 flex items-center"><AlertCircle className="w-4 h-4 mr-1" />{formErrors.expirationCode}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label htmlFor="parentTicker" className="block text-sm font-semibold text-gray-700">
                    Ticker parent
                  </label>
                  <input
                    id="parentTicker"
                    name="parentTicker"
                    value={form.parentTicker}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-200"
                  />
                  {formErrors.parentTicker && (
                    <p className="text-red-500 text-xs mt-1 flex items-center"><AlertCircle className="w-4 h-4 mr-1" />{formErrors.parentTicker}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label htmlFor="description" className="block text-sm font-semibold text-gray-700">
                    Description
                  </label>
                  <input
                    id="description"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-200"
                  />
                  {formErrors.description && (
                    <p className="text-red-500 text-xs mt-1 flex items-center"><AlertCircle className="w-4 h-4 mr-1" />{formErrors.description}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700">
                    Nom complet
                  </label>
                  <input
                    id="fullName"
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-200"
                  />
                  {formErrors.fullName && (
                    <p className="text-red-500 text-xs mt-1 flex items-center"><AlertCircle className="w-4 h-4 mr-1" />{formErrors.fullName}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label htmlFor="segment" className="block text-sm font-semibold text-gray-700">
                    Structure marché
                  </label>
                  <input
                    id="segment"
                    name="segment"
                    value={form.segment}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-200"
                  />
                  {formErrors.segment && (
                    <p className="text-red-500 text-xs mt-1 flex items-center"><AlertCircle className="w-4 h-4 mr-1" />{formErrors.segment}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label htmlFor="maturityDate" className="block text-sm font-semibold text-gray-700">
                    Date d'échéance
                  </label>
                  <input
                    id="maturityDate"
                    type="date"
                    name="maturityDate"
                    value={form.maturityDate}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-200"
                  />
                  {formErrors.maturityDate && (
                    <p className="text-red-500 text-xs mt-1 flex items-center"><AlertCircle className="w-4 h-4 mr-1" />{formErrors.maturityDate}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-3">
              {/* Boutons de mode avec animation */}
              <div className="flex space-x-2 mb-3">
                <button
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, depositType: 'AMOUNT' }))}
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 ${
                    isAmount 
                      ? 'bg-teal-600 text-white shadow-lg' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Montant fixe
                </button>
                <button
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, depositType: 'RATE' }))}
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 ${
                    isRate 
                      ? 'bg-teal-600 text-white shadow-lg' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Pourcentage
                </button>
              </div>

              {/* Champs calculés avec feedback visuel */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 flex items-center">
                    Taille de lot <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="lotSize"
                    value={form.lotSize}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-200"
                    required
                  />
                  {formErrors.lotSize && (
                    <p className="text-red-500 text-xs mt-1 flex items-center"><AlertCircle className="w-4 h-4 mr-1" />{formErrors.lotSize}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Type de dépôt <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="depositType"
                    value={form.depositType}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-200"
                    required
                  >
                    <option value="">Sélectionnez le type de dépôt</option>
                    {depositTypes.map(type => (<option key={type} value={type}>{type}</option>))}
                  </select>
                  {formErrors.depositType && (
                    <p className="text-red-500 text-xs mt-1 flex items-center"><AlertCircle className="w-4 h-4 mr-1" />{formErrors.depositType}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 flex items-center">
                    Montant de la marge initiale
                    {form.depositType && !isAmount && (
                      <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        Calculé automatiquement
                      </span>
                    )}
                  </label>
                  <input
                    type="text"
                    name="initialMarginAmount"
                    value={initialMarginAmountStr}
                    onChange={handleInitialMarginAmountInputChange}
                    readOnly={!isAmount}
                    className={`w-full px-4 py-2 border rounded-lg transition-all duration-200 ${
                      !isAmount && form.depositType
                        ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
                        : 'border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent hover:border-gray-400'
                    }`}
                  />
                  {formErrors.initialMarginAmount && (
                    <p className="text-red-500 text-xs mt-1 flex items-center"><AlertCircle className="w-4 h-4 mr-1" />{formErrors.initialMarginAmount}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 flex items-center">
                    Pourcentage de marge
                    {form.depositType && !isRate && (
                      <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        Calculé automatiquement
                      </span>
                    )}
                  </label>
                  <input
                    type="text"
                    name="percentageMargin"
                    value={percentageMarginStr}
                    onChange={handlePercentageMarginInputChange}
                    readOnly={!isRate}
                    className={`w-full px-4 py-2 border rounded-lg transition duration-200 ${
                      !isRate && form.depositType
                        ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
                        : 'border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent'
                    }`}
                  />
                  {formErrors.percentageMargin && (
                    <p className="text-red-500 text-xs mt-1 flex items-center"><AlertCircle className="w-4 h-4 mr-1" />{formErrors.percentageMargin}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Section Sous-jacents */}
              <section className="bg-white rounded-lg shadow p-3 border border-gray-100 hover:shadow-lg transition-all duration-200">
              

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Type du sous-jacent <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="underlyingType"
                      value={form.underlyingType}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-200"
                      required
                    >
                      <option value="">Sélectionnez le type du sous-jacent</option>
                      {underlyingTypes.map(type => (<option key={type} value={type}>{type}</option>))}
                    </select>
                    {formErrors.underlyingType && (
                      <p className="text-red-500 text-xs mt-1 flex items-center"><AlertCircle className="w-4 h-4 mr-1" />{formErrors.underlyingType}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Sous-jacent <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="underlyingId"
                      value={form.underlyingId}
                      onChange={handleChange}
                      disabled={!form.underlyingType}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-200"
                      required
                    >
                      <option value={0}>Sélectionnez le sous-jacent</option>
                      {underlyingAssets.map(asset => (<option key={asset.id} value={asset.id}>{asset.identifier}</option>))}
                    </select>
                    {formErrors.underlyingId && (
                      <p className="text-red-500 text-xs mt-1 flex items-center"><AlertCircle className="w-4 h-4 mr-1" />{formErrors.underlyingId}</p>
                    )}
                  </div>
                </div>
              </section>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-3">
              {/* Section Tick avec UX améliorée */}
              <div className="bg-gradient-to-r from-teal-50 to-white p-3 rounded-lg space-y-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Configuration des Ticks</h3>
                  <div className="relative group">
                    <Info className="w-5 h-5 text-gray-400 cursor-help" />
                    <Tooltip>
                      Configurez soit la Tick Value, soit le Multiplicateur. L'autre valeur sera calculée automatiquement.
                    </Tooltip>
                  </div>
                </div>

                {/* Tick Size avec validation visuelle */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Tick Size
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={tickSizeStr}
                      onChange={handleTickSizeChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg
                               transition-all duration-200
                               focus:ring-2 focus:ring-teal-500 focus:border-transparent
                               hover:border-gray-400"
                      placeholder="Ex: 0.01"
                    />
                    {parseFloat(tickSizeStr) > 0 && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-green-500"
                      >
                        <CheckCircle2 className="w-5 h-5" />
                      </motion.div>
                    )}
                  </div>
                  {formErrors.tickSize && (
                    <p className="text-red-500 text-xs mt-1 flex items-center"><AlertCircle className="w-4 h-4 mr-1" />{formErrors.tickSize}</p>
                  )}
                </div>

                {/* Boutons de mode avec animation */}
                <div className="relative">
                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={() => handleModeChange('tickValue')}
                      className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-300 transform
                                ${editMode === 'tickValue' 
                                  ? 'bg-teal-600 text-white scale-105 shadow-lg' 
                                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                      Saisir Tick Value
                    </button>
                    <button
                      type="button"
                      onClick={() => handleModeChange('contractMultiplier')}
                      className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-300 transform
                                ${editMode === 'contractMultiplier' 
                                  ? 'bg-teal-600 text-white scale-105 shadow-lg' 
                                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                      Saisir Multiplicateur
                    </button>
                  </div>
                </div>

                {/* Champs de saisie avec animation */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-medium text-gray-700">
                      Tick Value
                      {editMode !== 'tickValue' && (
                        <span className="ml-2 text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded">
                          Calculé automatiquement
                        </span>
                      )}
                    </label>
                    <motion.div
                      animate={{
                        scale: editMode === 'tickValue' ? 1 : 0.98,
                        opacity: editMode === 'tickValue' ? 1 : 0.8
                      }}
                    >
                      <input
                        type="number"
                        value={editMode === 'tickValue' ? tickValueInput : form.tickValue}
                        onChange={handleTickValueChange}
                        readOnly={editMode !== 'tickValue'}
                        className={`w-full px-4 py-2 border rounded-lg transition-all duration-200
                                  ${editMode !== 'tickValue'
                                    ? 'bg-gray-50 text-gray-500 cursor-not-allowed'
                                    : 'border-gray-300 focus:ring-2 focus:ring-teal-500 hover:border-gray-400'
                                  }`}
                      />
                      {formErrors.tickValue && (
                        <p className="text-red-500 text-xs mt-1 flex items-center"><AlertCircle className="w-4 h-4 mr-1" />{formErrors.tickValue}</p>
                      )}
                    </motion.div>
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-medium text-gray-700">
                      Multiplicateur
                      {editMode !== 'contractMultiplier' && (
                        <span className="ml-2 text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded">
                          Calculé automatiquement
                        </span>
                      )}
                    </label>
                    <motion.div
                      animate={{
                        scale: editMode === 'contractMultiplier' ? 1 : 0.98,
                        opacity: editMode === 'contractMultiplier' ? 1 : 0.8
                      }}
                    >
                      <input
                        type="number"
                        value={editMode === 'contractMultiplier' ? contractMultiplierInput : form.contractMultiplier}
                        onChange={handleContractMultiplierChange}
                        readOnly={editMode !== 'contractMultiplier'}
                        className={`w-full px-4 py-2 border rounded-lg transition-all duration-200
                                  ${editMode !== 'contractMultiplier'
                                    ? 'bg-gray-50 text-gray-500 cursor-not-allowed'
                                    : 'border-gray-300 focus:ring-2 focus:ring-teal-500 hover:border-gray-400'
                                  }`}
                      />
                      {formErrors.contractMultiplier && (
                        <p className="text-red-500 text-xs mt-1 flex items-center"><AlertCircle className="w-4 h-4 mr-1" />{formErrors.contractMultiplier}</p>
                      )}
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* Autres champs de négociation */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Date de première négociation <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="firstTradingDate"
                    value={form.firstTradingDate}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-200"
                    required
                  />
                  {formErrors.firstTradingDate && (
                    <p className="text-red-500 text-xs mt-1 flex items-center"><AlertCircle className="w-4 h-4 mr-1" />{formErrors.firstTradingDate}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Date de dernière négociation <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="lastTraadingDate"
                    value={form.lastTraadingDate}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-200"
                    required
                  />
                  {formErrors.lastTraadingDate && (
                    <p className="text-red-500 text-xs mt-1 flex items-center"><AlertCircle className="w-4 h-4 mr-1" />{formErrors.lastTraadingDate}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Devise de négociation <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="tradingCurrency"
                    value={form.tradingCurrency}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-200"
                    required
                  />
                  {formErrors.tradingCurrency && (
                    <p className="text-red-500 text-xs mt-1 flex items-center"><AlertCircle className="w-4 h-4 mr-1" />{formErrors.tradingCurrency}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Mode de livraison <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="settlementMethod"
                    value={form.settlementMethod}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-200"
                    required
                  >
                    <option value="">Sélectionnez la méthode de règlement</option>
                    {settlementMethods.map(method => (<option key={method} value={method}>{method}</option>))}
                  </select>
                  {formErrors.settlementMethod && (
                    <p className="text-red-500 text-xs mt-1 flex items-center"><AlertCircle className="w-4 h-4 mr-1" />{formErrors.settlementMethod}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Cotation <span className="text-red-500">*</span>
                  </label>
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={() => setForm(prev => ({ ...prev, instrumentStatus: true }))}
                      className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
                        form.instrumentStatus 
                          ? 'bg-green-600 text-white shadow-lg' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      Côté
                    </button>
                    <button
                      type="button"
                      onClick={() => setForm(prev => ({ ...prev, instrumentStatus: false }))}
                      className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
                        !form.instrumentStatus 
                          ? 'bg-red-600 text-white shadow-lg' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      Non côté
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
  <div className="min-h-screen bg-gradient-to-br from-teal-50 to-white py-2">
    <div className="max-w-4xl mx-auto px-2">
      {/* Titre principal */}
      <div className="text-center mb-3">
        <h1 className="text-2xl font-bold text-gray-900">Créer un Future</h1>
        <p className="mt-1 text-xs text-gray-600">Remplissez les informations nécessaires pour créer un nouveau Future</p>
      </div>

      {/* Stepper avec espacement minimal */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          {formSections.map((section, index) => (
            <div
              key={section.id}
              className={`flex items-center ${
                index <= currentStep ? 'text-teal-600' : 'text-gray-400'
              }`}
            >
              <div
                className={`
                  w-5 h-5 rounded-full flex items-center justify-center mr-1 text-xs
                  ${
                    completedSteps.has(index)
                      ? 'bg-teal-600 text-white'
                      : index === currentStep
                      ? 'bg-teal-100 text-teal-600 border border-teal-600'
                      : 'bg-gray-100 text-gray-400'
                  }
                `}
              >
                {completedSteps.has(index) ? '✓' : index + 1}
              </div>
              <span className="hidden sm:block text-xs font-medium">
                {section.title}
              </span>
              {index < formSections.length - 1 && (
                <div className="hidden sm:block w-6 h-0.5 mx-1 bg-gray-200" />
              )}
            </div>
          ))}
        </div>
        {/* Barre de progression */}
        <div className="relative h-1 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="absolute h-full bg-teal-600 transition-all duration-300 ease-out"
            style={{ width: `${((currentStep + 1) / formSections.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Section active avec espacement minimal */}
      {currentStep === formSections.length - 1 ? (
        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-lg shadow p-2 relative overflow-hidden max-h-[calc(100vh-200px)] overflow-y-auto">
            {/* En-tête de la section avec espacement minimal */}
            <div className="flex items-center mb-2">
              <div className="p-1.5 bg-teal-100 rounded mr-2">
                {formSections[currentStep].icon}
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-800">
                  {formSections[currentStep].title}
                </h2>
                <p className="text-xs text-gray-600">
                  {formSections[currentStep].description}
                </p>
              </div>
            </div>
            <div className="transition-all duration-300 transform">
              {renderStepContent()}
            </div>
          </div>
          {/* Navigation */}
          <div className="flex justify-between mt-3">
            <button
              type="button"
              onClick={prevStep}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                currentStep === 0
                  ? 'opacity-50 cursor-not-allowed bg-gray-200'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
              disabled={currentStep === 0}
            >
              ← Précédent
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-6 py-2 bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-lg text-sm font-semibold
                       hover:from-teal-700 hover:to-teal-800 transition-all duration-200
                       focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-teal-500
                       ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <span className="flex items-center">
                {isSubmitting ? 'Création en cours...' : 'Créer le Future'}
                {!isSubmitting && <ChevronRight className="w-4 h-4 ml-2" />}
              </span>
            </button>
          </div>
        </form>
      ) : (
        <div>
          <div className="bg-white rounded-lg shadow p-2 relative overflow-hidden max-h-[calc(100vh-200px)] overflow-y-auto">
            {/* En-tête de la section avec espacement minimal */}
            <div className="flex items-center mb-2">
              <div className="p-1.5 bg-teal-100 rounded mr-2">
                {formSections[currentStep].icon}
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-800">
                  {formSections[currentStep].title}
                </h2>
                <p className="text-xs text-gray-600">
                  {formSections[currentStep].description}
                </p>
              </div>
            </div>
            <div className="transition-all duration-300 transform">
              {renderStepContent()}
            </div>
          </div>
          {/* Navigation */}
          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={prevStep}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                currentStep === 0
                  ? 'opacity-50 cursor-not-allowed bg-gray-200'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
              disabled={currentStep === 0}
            >
              ← Précédent
            </button>
            <button
              type="button"
              onClick={nextStep}
              className="px-6 py-3 bg-teal-600 text-white rounded-lg font-medium
                       hover:bg-teal-700 transition-all duration-200"
            >
              Suivant →
            </button>
          </div>
        </div>
      )}
    </div>
  </div>
);
};

export default FutureCreationForm;