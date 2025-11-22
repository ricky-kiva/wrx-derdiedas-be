import Noun from '../../../../../domains/noun/entities/Noun';

export interface StartGameDTO {
  id: string;
  nouns: Omit<Noun, 'gender'>[]
}
