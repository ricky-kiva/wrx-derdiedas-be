import z from 'zod';
import { EndGamePayloadSchema, GameIdParamSchema, GetGameByIdPayloadSchema, SubmitAnswerPayloadSchema, UpdateGamePayloadSchema } from './schemas';

export type EndGamePayload = z.infer<typeof EndGamePayloadSchema>;
export type GameIdParam = z.infer<typeof GameIdParamSchema>;
export type GetGameByIdPayload = z.infer<typeof GetGameByIdPayloadSchema>;
export type SubmitAnswerPayload = z.infer<typeof SubmitAnswerPayloadSchema>;
export type UpdateGamePayload = z.infer<typeof UpdateGamePayloadSchema>;
