import Game from '../../../../../domains/game/entities/Game';

export interface UpdateGameCmd {
  id: string;
  gameToken: string;
  payload: Partial<Pick<Game, 'userId'>>;
}
