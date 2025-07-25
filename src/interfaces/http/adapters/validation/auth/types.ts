import z from 'zod';
import { LoginPayloadSchema, LogoutPayloadSchema } from './schemas';

export type LoginPayload = z.infer<typeof LoginPayloadSchema>;
export type LogoutPayload = z.infer<typeof LogoutPayloadSchema>;
