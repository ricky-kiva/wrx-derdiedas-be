import z from 'zod';

export const LoginPayloadSchema = z.object({
  googleIdToken: z.string().min(1, "googleIdToken is required")
});

export const LogoutPayloadSchema = z.object({
  id: z.string()
    .min(1, "User ID is required")
    .regex(/^[a-f\d]{24}$/i, "User ID is not valid")
});

export const RefreshTokenPayloadSchema = z.object({
  refreshToken: z.string().min(1, "refreshToken is required")
});
