import { z } from 'zod';

export const SearchNounPayloadSchema = z.object({
  word: z.string().min(1, "word is required.")
});

export const LoginPayloadSchema = z.object({
  googleIdToken: z.string().min(1, "googleIdToken is required"),
  name: z.string().min(1, "name is required")
});
