import { GameParams } from '../../../../../domains/game/entities/Game';
import Noun from '../../../../../domains/noun/entities/Noun';

export type GetGameByIdDTO = Omit<GameParams, 'nouns'> & {
  nouns: Omit<Noun, 'gender'>[]
};
