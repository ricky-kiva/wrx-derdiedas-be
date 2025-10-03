import { z } from 'zod';
import GetLeaderboardQ from '../../../../../applications/use-cases/leaderboard/get/query/GetLeaderboardQ';

export const GetLeaderboardQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(10).max(100).default(25),
}) satisfies z.ZodType<GetLeaderboardQ, z.ZodTypeDef, unknown>;
