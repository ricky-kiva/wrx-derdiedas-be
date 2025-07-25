import { Router } from 'express';
import { DependencyContainer } from 'tsyringe';
import AuthHandler from './handler';
import { DITokens } from '../../../../commons/DITokens';
import zodParser from '../../middlewares/validation/zodParser';
import { LoginPayloadSchema, LogoutPayloadSchema, RefreshTokenPayloadSchema } from '../../adapters/validation/auth/schemas';

export default function loginRoutes(c: DependencyContainer): Router {
  const r = Router();
  const h = c.resolve<AuthHandler>(DITokens.AuthHandler);

  r.post('/login', zodParser(LoginPayloadSchema), async (req, res) => h.login(req, res));
  r.post('/logout', zodParser(LogoutPayloadSchema), async (req, res) => h.logout(req, res));
  r.post('/refresh-token', zodParser(RefreshTokenPayloadSchema), async (req, res) => h.refreshToken(req, res));

  return r;
}
