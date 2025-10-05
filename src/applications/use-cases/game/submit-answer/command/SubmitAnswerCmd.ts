import { Gender } from '../../../../../domains/noun/entities/Noun';

export interface SubmitAnswerCmd {
  gameId: string;
  nounId: string;
  answer: Gender;
  userId?: string;
}
