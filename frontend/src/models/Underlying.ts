import { UnderlyingType } from './enums/index';

export interface Underlying {
  id?: number;
  identifier?: string;
  underlyingType?: UnderlyingType;
}
