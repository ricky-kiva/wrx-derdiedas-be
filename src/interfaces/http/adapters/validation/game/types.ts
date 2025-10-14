import z from 'zod';
import { EndGamePayloadSchema, SubmitAnswerPayloadSchema } from './schemas';

export type SubmitAnswerPayload = z.infer<typeof SubmitAnswerPayloadSchema>;
export type EndGamePayload = z.infer<typeof EndGamePayloadSchema>;
