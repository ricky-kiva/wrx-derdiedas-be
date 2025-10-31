import z from 'zod';
import { LoginPayloadSchema, LogoutPayloadSchema, RefreshTokenPayloadSchema } from './schemas';
import { Request } from 'express';

export interface CookieRequest extends Request {
  cookies: {
    refreshToken?: string
  }
}

export type LoginPayload = z.infer<typeof LoginPayloadSchema>;
export type LogoutPayload = z.infer<typeof LogoutPayloadSchema>;
export type RefreshTokenPayload = z.infer<typeof RefreshTokenPayloadSchema>;
