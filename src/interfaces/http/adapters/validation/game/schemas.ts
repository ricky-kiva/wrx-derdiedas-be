import { z } from 'zod';
import { GENDER_VALUES } from '../../../../../domains/noun/entities/Noun';
import { SubmitAnswerCmd } from '../../../../../applications/use-cases/game/submit-answer/command/SubmitAnswerCmd';
import { EndGameCmd } from '../../../../../applications/use-cases/game/end/commands/EndGameCmd';
import { UpdateGameCmd } from '../../../../../applications/use-cases/game/update/commands/UpdateGameCmd';

export const EndGamePayloadSchema = z.object({
  name: z.string()
    .max(30, 'Name cannot exceed 30 characters')
    .optional()
}).optional() satisfies z.ZodType<(Omit<EndGameCmd, 'gameId'> | undefined), z.ZodTypeDef, unknown>;

export const GameIdParamSchema = z.object({
  id: z.string()
    .min(1, 'Game ID is required')
    .regex(/^game-[0-9a-fA-F-]{36}$/, 'Game ID is not valid'),
});

export const SubmitAnswerPayloadSchema = z.object({
  nounId: z.string()
    .min(1, 'Noun ID is required')
    .regex(/^[a-f\d]{24}$/i, 'Noun ID is not valid'),
  answer: z.enum(GENDER_VALUES, { 
    errorMap: () => ({ message: 'Answer must be masculine, feminine, or neuter' }) 
  })
}) satisfies z.ZodType<Omit<SubmitAnswerCmd, 'gameId'>, z.ZodTypeDef, unknown>;

export const UpdateGamePayloadSchema = z.object({
  userId: z.string()
    .regex(/^[a-f\d]{24}$/i, 'User ID is not valid')
    .optional()
}) satisfies z.ZodType<Omit<UpdateGameCmd, 'id'>['payload'], z.ZodTypeDef, unknown>;
