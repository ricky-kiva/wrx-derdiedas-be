import { z } from 'zod';
import { GENDER_VALUES } from '../../../../../domains/noun/entities/Noun';
import { SubmitAnswerCmd } from '../../../../../applications/use-cases/game/submit-answer/command/SubmitAnswerCmd';
import { EndGameCmd } from '../../../../../applications/use-cases/game/end/commands/EndGameCmd';
import { UpdateGameCmd } from '../../../../../applications/use-cases/game/update/commands/UpdateGameCmd';

export const EndGamePayloadSchema = z.object({
  name: z.string().optional()
}).optional() satisfies z.ZodType<(Omit<EndGameCmd, 'gameId'> | undefined), z.ZodTypeDef, unknown>;

export const GameIdParamSchema = z.object({
  id: z.string().min(1, 'Game ID is required'),
});

export const SubmitAnswerPayloadSchema = z.object({
  nounId: z.string().min(1),
  answer: z.enum(GENDER_VALUES)
}) satisfies z.ZodType<Omit<SubmitAnswerCmd, 'gameId'>, z.ZodTypeDef, unknown>;

export const UpdateGamePayloadSchema = z.object({
  userId: z.string().optional()
}) satisfies z.ZodType<Omit<UpdateGameCmd, 'id'>['payload'], z.ZodTypeDef, unknown>;
