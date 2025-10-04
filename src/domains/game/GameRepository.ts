import Game from './entities/Game';

export default interface GameRepository {
  save(game: Game): Promise<void>;
  findById(gameId: string): Promise<Game | null>;
  delete(gameId: string): Promise<void>;
}
