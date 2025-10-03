import z from 'zod';
import { GetLeaderboardQPSchema, SubmitPointPayloadSchema } from './schemas';

export type GetLeaderboardQuery = z.infer<typeof GetLeaderboardQPSchema>;
export type SubmitPointPayload = z.infer<typeof SubmitPointPayloadSchema>;
