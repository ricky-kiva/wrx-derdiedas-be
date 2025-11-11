import z from 'zod';
import { DeleteUserParamSchema, GetUserPointParamSchema, UpdateUserNameParamsSchema, UpdateUserNamePayloadSchema } from './schemas';

export type GetUserPointParams = z.infer<typeof GetUserPointParamSchema>;
export type DeleteUserParams = z.infer<typeof DeleteUserParamSchema>;
export type UpdateUserNameParams = z.infer<typeof UpdateUserNameParamsSchema>;
export type UpdateUserNamePayload = z.infer<typeof UpdateUserNamePayloadSchema>;
