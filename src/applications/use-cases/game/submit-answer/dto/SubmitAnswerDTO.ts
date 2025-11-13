import Noun from '../../../../../domains/noun/entities/Noun';

export interface SubmitAnswerDTO {
  correct: boolean;
  currentScore: number;
  nouns?: Omit<Noun, 'gender'>[];
}
