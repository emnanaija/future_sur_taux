import { Asset } from './Asset';
import { UnderlyingType } from './enums/index';
import { Underlying } from './Underlying';



export interface UnderlyingAsset extends Underlying {
  asset?: Asset;
}
