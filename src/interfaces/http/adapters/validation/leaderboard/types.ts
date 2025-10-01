import z from 'zod';
import { GetLeaderboardQuerySchema } from './schemas';

export type GetLeaderboardQuery = z.infer<typeof GetLeaderboardQuerySchema>;
