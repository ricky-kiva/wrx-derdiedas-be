import Noun from '../../noun/entities/Noun';

export interface GamePayload {
  id: string;
  nouns: Noun[];
  userId?: string;
  points?: number;
}

export type GameParams = GamePayload;

export default class Game {
  public readonly id: string;
  public readonly userId?: string;
  public readonly nouns: Noun[];
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

  decrementPoints(amount: number) {
    this.points -= amount;
    if (this.points < 0) this.points = 0;
  }
}
