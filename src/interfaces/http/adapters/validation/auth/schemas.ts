import z from 'zod';

export const LoginPayloadSchema = z.object({
  googleIdToken: z.string().min(1, "googleIdToken is required"),
  name: z.string().min(1, "name is required")
});
