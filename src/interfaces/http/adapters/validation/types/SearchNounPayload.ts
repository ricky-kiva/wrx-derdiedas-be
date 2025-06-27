import { z } from 'zod';
import { SearchNounPayloadSchema } from '../schemas/SearchNounPayloadSchema';

export type SearchNounPayload = z.infer<typeof SearchNounPayloadSchema>;
