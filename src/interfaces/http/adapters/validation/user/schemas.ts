import z from 'zod';
import { UpdateUserNameCmd } from '../../../../../applications/use-cases/user/update-name/commands/UpdateUserNameCmd';

export const UserIdParamSchema = z.object({
  id: z.string().min(1, 'User ID is required'),
});

export const GetUserPointParamSchema = UserIdParamSchema;
export const DeleteUserParamSchema = UserIdParamSchema;
export const UpdateUserNameParamsSchema = UserIdParamSchema;

export const UpdateUserNamePayloadSchema = z.object({
  name: z.string().min(1, 'Name is required'),
}) satisfies z.ZodType<Omit<UpdateUserNameCmd, 'id'>, z.ZodTypeDef, unknown>;
