import Noun from '../../../../../domains/noun/entities/Noun';

export interface StartGameDTO {
  gameId: string;
  nouns: Omit<Noun, 'gender'>[]
}
