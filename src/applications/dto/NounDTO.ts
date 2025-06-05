import { Gender } from '../../domains/noun/entities/Noun';

export interface NounDTO {
  id: string,
  word: string,
  gender: Gender
}
