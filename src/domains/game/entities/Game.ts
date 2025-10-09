import Noun from '../../noun/entities/Noun';

export interface GamePayload {
  id: string;
  nouns: Omit<Noun, ('meanings' | 'word')>[];
  userId?: string;
  points?: number;
}

export type GameParams = GamePayload;

export default class Game {
  public readonly id: string;
  public readonly userId?: string;
  public readonly nouns: Omit<Noun, ('meanings' | 'word')>[];
  public points: number;
  
  constructor(params: GamePayload) {
    this.id = params.id;
    this.userId = params.userId;
    this.nouns = params.nouns;
    this.points = params.points ?? 0;
  }

  incrementPoints(amount: number) {
    this.points += amount;
  }
}
