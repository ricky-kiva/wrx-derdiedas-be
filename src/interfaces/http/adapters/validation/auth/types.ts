import z from 'zod';
import { LoginPayloadSchema } from './schemas';

export type LoginPayload = z.infer<typeof LoginPayloadSchema>;