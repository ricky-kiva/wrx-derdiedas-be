import { z } from 'zod';
import { GENDER_VALUES } from '../../../../../domains/noun/entities/Noun';
import { SubmitAnswerCmd } from '../../../../../applications/use-cases/game/submit-answer/command/SubmitAnswerCmd';

export const SubmitAnswerPayloadSchema = z.object({
  gameId: z.string().min(1),
  nounId: z.string().min(1),
  answer: z.enum(GENDER_VALUES),
  userId: z.string().optional()
}) satisfies z.ZodType<SubmitAnswerCmd, z.ZodTypeDef, unknown> ;
