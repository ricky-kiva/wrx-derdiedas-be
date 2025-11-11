import z from 'zod';
import { UpdateUserCmd } from '../../../../../applications/use-cases/user/update/commands/UpdateUserCmd';

export const UserIdParamSchema = z.object({
  id: z.string().min(1, 'User ID is required'),
});

export const GetUserPointParamSchema = UserIdParamSchema;
export const DeleteUserParamSchema = UserIdParamSchema;
export const UpdateUserParamsSchema = UserIdParamSchema;

export const UpdateUserPayloadSchema = z.object({
  name: z.string().min(1, 'Name is required')
}) satisfies z.ZodType<Omit<UpdateUserCmd, 'id'>['payload'], z.ZodTypeDef, unknown>;
