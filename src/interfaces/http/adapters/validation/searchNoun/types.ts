import { z } from 'zod';
import { LoginPayloadSchema, SearchNounPayloadSchema } from './schemas';

export type SearchNounPayload = z.infer<typeof SearchNounPayloadSchema>;
export type LoginPayload = z.infer<typeof LoginPayloadSchema>;
