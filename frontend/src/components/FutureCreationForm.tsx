import React, { useState, useEffect } from 'react';
import axios from 'axios';

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

  const [settlementMethods, setSettlementMethods] = useState<string[]>([]);
  const [depositTypes, setDepositTypes] = useState<string[]>([]);
  const [underlyingTypes, setUnderlyingTypes] = useState<string[]>([]);
  const [underlyingAssets, setUnderlyingAssets] = useState<{ id: number; identifier: string }[]>([]);

  const [editMode, setEditMode] = useState<'tickValue' | 'contractMultiplier'>('tickValue');
  const [tickSizeStr, setTickSizeStr] = useState('');
  const [tickValueInput, setTickValueInput] = useState(0);
  const [contractMultiplierInput, setContractMultiplierInput] = useState(0);

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


  const parseTickSize = (str: string): number => {
    if (!str) return 0;
    const val = parseFloat(str);
    return isNaN(val) ? 0 : val;
  };

  const isRate = form.depositType === 'RATE';
  const isAmount = form.depositType === 'AMOUNT';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
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

  return (
  <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6 space-y-8">
    <section className="p-4 border rounded space-y-4 bg-gray-100">
      <h2 className="text-xl font-bold">Informations Générales</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="symbol" className="block mb-1 font-semibold">Symbol</label>
          <input id="symbol" name="symbol" placeholder="Symbol" value={form.symbol} onChange={handleChange} className="border p-2 rounded w-full" required />
        </div>
        <div>
          <label htmlFor="description" className="block mb-1 font-semibold">Description</label>
          <input id="description" name="description" placeholder="Description" value={form.description} onChange={handleChange} className="border p-2 rounded w-full" />
        </div>
        <div>
          <label htmlFor="isin" className="block mb-1 font-semibold">ISIN</label>
          <input id="isin" name="isin" placeholder="ISIN" value={form.isin} onChange={handleChange} className="border p-2 rounded w-full" />
        </div>
        <div>
          <label htmlFor="expirationCode" className="block mb-1 font-semibold">Expiration Code</label>
          <input id="expirationCode" name="expirationCode" placeholder="Expiration Code" value={form.expirationCode} onChange={handleChange} className="border p-2 rounded w-full" />
        </div>
        <div>
          <label htmlFor="parentTicker" className="block mb-1 font-semibold">Parent Ticker</label>
          <input id="parentTicker" name="parentTicker" placeholder="Parent Ticker" value={form.parentTicker} onChange={handleChange} className="border p-2 rounded w-full" />
        </div>
        <div>
          <label htmlFor="fullName" className="block mb-1 font-semibold">Full Name</label>
          <input id="fullName" name="fullName" placeholder="Full Name" value={form.fullName} onChange={handleChange} className="border p-2 rounded w-full" />
        </div>
        <div>
          <label htmlFor="segment" className="block mb-1 font-semibold">Segment</label>
          <input id="segment" name="segment" placeholder="Segment" value={form.segment} onChange={handleChange} className="border p-2 rounded w-full" />
        </div>
        <div>
          <label htmlFor="maturityDate" className="block mb-1 font-semibold">Maturity Date</label>
          <input id="maturityDate" type="date" name="maturityDate" placeholder="Maturity Date" value={form.maturityDate} onChange={handleChange} className="border p-2 rounded w-full" />
        </div>
        <div>
          <label htmlFor="firstTradingDate" className="block mb-1 font-semibold">First Trading Date</label>
          <input id="firstTradingDate" type="date" name="firstTradingDate" placeholder="First Trading Date" value={form.firstTradingDate} onChange={handleChange} className="border p-2 rounded w-full" />
        </div>
        <div>
          <label htmlFor="lastTraadingDate" className="block mb-1 font-semibold">Last Trading Date</label>
          <input id="lastTraadingDate" type="date" name="lastTraadingDate" placeholder="Last Trading Date" value={form.lastTraadingDate} onChange={handleChange} className="border p-2 rounded w-full" />
        </div>
        <div>
          <label htmlFor="tradingCurrency" className="block mb-1 font-semibold">Trading Currency</label>
          <input id="tradingCurrency" name="tradingCurrency" placeholder="Trading Currency" value={form.tradingCurrency} onChange={handleChange} className="border p-2 rounded w-full" />
        </div>
      </div>
    </section>

    <section className="p-4 border rounded space-y-4 bg-gray-100">
      <h2 className="text-xl font-bold">Paramètres Underlying</h2>
      <div>
        <label htmlFor="underlyingType" className="block mb-1 font-semibold">Underlying Type</label>
        <select id="underlyingType" name="underlyingType" value={form.underlyingType} onChange={handleChange} className="border p-2 rounded w-full">
          <option value="">Sélectionnez le Underlying Type</option>
          {underlyingTypes.map(type => (<option key={type} value={type}>{type}</option>))}
        </select>
      </div>
      <div>
        <label htmlFor="underlyingId" className="block mb-1 font-semibold">Underlying Asset</label>
        <select id="underlyingId" name="underlyingId" value={form.underlyingId} onChange={handleChange} disabled={!form.underlyingType} className="border p-2 rounded w-full">
          <option value={0}>Sélectionnez l'Asset</option>
          {underlyingAssets.map(asset => (<option key={asset.id} value={asset.id}>{asset.identifier}</option>))}
        </select>
      </div>
    </section>

    <section className="p-4 border rounded space-y-4 bg-gray-100">
      <h2 className="text-xl font-bold">Détails de Dépôt, Lot Size et Ticks</h2>

      <div>
        <label htmlFor="depositType" className="block mb-1 font-semibold">Deposit Type</label>
        <select id="depositType" name="depositType" value={form.depositType} onChange={handleChange} className="border p-2 rounded w-full">
          <option value="">Sélectionnez le Deposit Type</option>
          {depositTypes.map(type => (<option key={type} value={type}>{type}</option>))}
        </select>
      </div>

      <div>
        <label htmlFor="lotSize" className="block mb-1 font-semibold">Lot Size</label>
        <input id="lotSize" type="number" name="lotSize" placeholder="Lot Size" value={form.lotSize} onChange={handleChange} className="border p-2 rounded w-full" />
      </div>

      <div>
        <label htmlFor="initialMarginAmount" className="block mb-1 font-semibold">Initial Margin Amount</label>
        <input id="initialMarginAmount" type="number" name="initialMarginAmount" placeholder="Initial Margin Amount" value={form.initialMarginAmount} onChange={handleInitialMarginAmountChange} readOnly={!isAmount} className={`border p-2 rounded w-full ${!isAmount ? 'bg-gray-200' : ''}`} />
      </div>

      <div>
        <label htmlFor="percentageMargin" className="block mb-1 font-semibold">Percentage Margin</label>
        <input id="percentageMargin" type="number" name="percentageMargin" placeholder="Percentage Margin" value={form.percentageMargin} onChange={handlePercentageMarginChange} readOnly={!isRate} className={`border p-2 rounded w-full ${!isRate ? 'bg-gray-200' : ''}`} />
      </div>

      <div className="flex space-x-2">
        <button type="button" onClick={() => handleModeChange('tickValue')} className={`flex-1 p-2 rounded ${editMode === 'tickValue' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>Saisir Tick Value</button>
        <button type="button" onClick={() => handleModeChange('contractMultiplier')} className={`flex-1 p-2 rounded ${editMode === 'contractMultiplier' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>Saisir Contract Multiplier</button>
      </div>

      <div>
        <label htmlFor="tickSize" className="block mb-1 font-semibold">Tick Size</label>
        <input id="tickSize" type="text" name="tickSize" placeholder="Tick Size" value={tickSizeStr} onChange={handleTickSizeChange} className="border p-2 rounded w-full" />
      </div>

      <div>
        <label htmlFor="tickValue" className="block mb-1 font-semibold">Tick Value {editMode === 'tickValue' ? '' : '(calculé)'}</label>
        <input
          id="tickValue"
          type="number"
          name="tickValue"
          placeholder="Tick Value"
          value={editMode === 'tickValue' ? tickValueInput : form.tickValue}
          onChange={handleTickValueChange}
          readOnly={editMode !== 'tickValue'}
          className={`border p-2 rounded w-full ${editMode !== 'tickValue' ? 'bg-gray-200' : ''}`}
        />
      </div>

      <div>
        <label htmlFor="contractMultiplier" className="block mb-1 font-semibold">Contract Multiplier {editMode === 'contractMultiplier' ? '' : '(calculé)'}</label>
        <input
          id="contractMultiplier"
          type="number"
          name="contractMultiplier"
          placeholder="Contract Multiplier"
          value={editMode === 'contractMultiplier' ? contractMultiplierInput : form.contractMultiplier}
          onChange={handleContractMultiplierChange}
          readOnly={editMode !== 'contractMultiplier'}
          className={`border p-2 rounded w-full ${editMode !== 'contractMultiplier' ? 'bg-gray-200' : ''}`}
        />
      </div>
    </section>

    <section className="p-4 border rounded space-y-4 bg-gray-100">
      <h2 className="text-xl font-bold">Règlement et Statut</h2>
      <div>
        <label htmlFor="settlementMethod" className="block mb-1 font-semibold">Settlement Method</label>
        <select id="settlementMethod" name="settlementMethod" value={form.settlementMethod} onChange={handleChange} className="border p-2 rounded w-full">
          <option value="">Sélectionnez le Settlement Method</option>
          {settlementMethods.map(method => (<option key={method} value={method}>{method}</option>))}
        </select>
      </div>
      <label className="flex items-center space-x-2">
        <input type="checkbox" name="instrumentStatus" checked={form.instrumentStatus} onChange={handleChange} className="border rounded" />
        <span>Instrument Actif</span>
      </label>
    </section>

    <button type="submit" className="bg-blue-600 text-white p-3 rounded w-full">Créer Future</button>
  </form>
);
};

export default FutureCreationForm;
