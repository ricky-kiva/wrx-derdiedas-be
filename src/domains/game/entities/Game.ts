import Noun from '../../noun/entities/Noun';

export interface GamePayload {
  id: string;
  userId?: string;
  nouns: Omit<Noun, ('meanings' | 'word')>[],
}

export type GameParams = GamePayload;

export default class Game {
  public readonly id: string;
  public readonly userId?: string;
  public readonly nouns: Omit<Noun, ('meanings' | 'word')>[];
  
  constructor(params: GamePayload) {
    this.id = params.id;
    this.userId = params.userId;
    this.nouns = params.nouns;
  }
}
