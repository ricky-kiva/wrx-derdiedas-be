import { z } from 'zod';
import GetLeaderboardQ from '../../../../../applications/use-cases/leaderboard/get/query/GetLeaderboardQ';
import SubmitPointCmd from '../../../../../applications/use-cases/leaderboard/submit-point/command/SubmitPointCmd';

export const GetLeaderboardQPSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(10).max(100).default(25),
}) satisfies z.ZodType<GetLeaderboardQ, z.ZodTypeDef, unknown>;

export const SubmitPointPayloadSchema = z.object({
  point: z.number().default(10),
  updatedAt: z.preprocess((arg) => {
    if (arg instanceof Date) return arg;
    if (typeof arg === 'string') return new Date(arg);
    
    return arg;
  }, z.date()),
  name: z.string().optional(),
  userId: z.string().optional()
}) satisfies z.ZodType<SubmitPointCmd, z.ZodTypeDef, unknown>;
