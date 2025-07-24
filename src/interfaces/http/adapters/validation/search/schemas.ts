import { z } from 'zod';

export const SearchNounPayloadSchema = z.object({
  word: z.string().min(1, "word is required.")
});
