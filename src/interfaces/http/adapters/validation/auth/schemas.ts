import z from 'zod';

export const LoginPayloadSchema = z.object({
  googleIdToken: z.string().min(1, "googleIdToken is required"),
  name: z.string().min(1, "name is required")
});

export const LogoutPayloadSchema = z.object({
  id: z.string().min(1, "id of user is required")
});

export const RefreshTokenPayloadSchema = z.object({
  refreshToken: z.string().min(1, "refreshToken is required")
});
