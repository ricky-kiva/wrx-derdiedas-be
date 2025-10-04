import Noun from '../../noun/entities/Noun';

export interface GamePayload {
  id: string;
  userId?: string;
  words: Omit<Noun, 'meanings'>[],
}

export type GameParams = GamePayload;

export default class Game {
  public readonly id: string;
  public readonly userId?: string;
  public readonly words: Omit<Noun, 'meanings'>[];
  
  constructor(params: GamePayload) {
    this.id = params.id;
    this.userId = params.userId;
    this.words = params.words;
  }
}
