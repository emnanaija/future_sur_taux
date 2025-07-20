// src/services/futureService.ts
import axios from 'axios';
import { FutureCreationDTO } from '../models/FutureCreationDTO';  // ton type DTO
import { Future } from '../models/Future';  // ton type Future

const API_URL = '/api/futures';

export const createFuture = async (dto: FutureCreationDTO): Promise<Future> => {
  const response = await axios.post<Future>(API_URL, dto);
  return response.data;
};
