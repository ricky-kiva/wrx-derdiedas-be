import z from 'zod';
import { UpdateUserCmd } from '../../../../../applications/use-cases/user/update/commands/UpdateUserCmd';

export const UserIdParamSchema = z.object({
  id: z.string()
    .min(1, 'User ID is required')
    .regex(/^[a-f\d]{24}$/i, 'User ID is not valid')
});

export const UpdateUserPayloadSchema = z.object({
  name: z.string()
    .min(1, 'Name cannot be empty')
    .max(30, 'Name cannot exceed 30 characters')
    .optional()
}) satisfies z.ZodType<Omit<UpdateUserCmd, 'id'>['payload'], z.ZodTypeDef, unknown>;
