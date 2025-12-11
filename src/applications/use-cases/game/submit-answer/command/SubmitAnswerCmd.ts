import { Gender } from '../../../../../domains/noun/entities/Noun';

export interface SubmitAnswerCmd {
  gameToken: string;
  gameId: string;
  nounId: string;
  answer: Gender;
}
