import { NounParams } from '../../../../domains/noun/entities/Noun';

export interface NounRawDTO extends NounParams {
  normalized: string
}
