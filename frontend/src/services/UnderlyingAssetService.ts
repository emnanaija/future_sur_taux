
import axios from 'axios';
import { UnderlyingAsset } from '../models/UnderlyingAsset';  // ton type Future

export class UnderlyingAssetService {
  private static API_URL = '/api/underlying-assets';

  // Récupérer la liste des UnderlyingAsset par type
  static async getByType(type: string): Promise<UnderlyingAsset[]> {
    const response = await axios.get<UnderlyingAsset[]>(this.API_URL, {
      params: { type },
    });
    return response.data;
  }
}