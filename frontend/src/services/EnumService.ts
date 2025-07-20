// services/EnumService.ts
import axios from 'axios';
import type { SettlementMethod, DepositType } from '../models/enums';

const API_BASE = '/api/enums';

export const getSettlementMethods = async (): Promise<SettlementMethod[]> => {
  const response = await axios.get<SettlementMethod[]>(`${API_BASE}/settlement-methods`);
  return response.data;
};

export const getDepositTypes = async (): Promise<DepositType[]> => {
  const response = await axios.get<DepositType[]>(`${API_BASE}/deposit-types`);
  return response.data;
};
