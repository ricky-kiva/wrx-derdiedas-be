import { z } from 'zod';
import GetLeaderboardQ from '../../../../../applications/use-cases/leaderboard/get/query/GetLeaderboardQ';
import SubmitPointCmd from '../../../../../applications/use-cases/leaderboard/submit-point/command/SubmitPointCmd';

export const GetLeaderboardQPSchema = z.object({
  page: z.coerce.number({
      invalid_type_error: 'Page must be a number',
    })
    .int('Page must be an integer')
    .min(1, 'Page must be at least 1')
    .default(1),
  limit: z.coerce.number({
      invalid_type_error: 'Limit must be a number',
    })
    .int('Limit must be an integer')
    .default(25)
    .transform((val) => Math.min(Math.max(val, 10), 150))
    .transform((val) => Math.min((Math.max(val, 10)), 150)),
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
