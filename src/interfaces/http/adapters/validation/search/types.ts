import { z } from 'zod';
import { SearchNounPayloadSchema } from './schemas';

export type SearchNounPayload = z.infer<typeof SearchNounPayloadSchema>;
