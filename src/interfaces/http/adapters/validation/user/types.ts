import z from 'zod';
import { UpdateUserPayloadSchema, UserIdParamSchema } from './schemas';

export type UserIdParam = z.infer<typeof UserIdParamSchema>;
export type UpdateUserNamePayload = z.infer<typeof UpdateUserPayloadSchema>;
