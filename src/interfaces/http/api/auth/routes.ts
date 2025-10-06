import { Router } from 'express';
import { DependencyContainer } from 'tsyringe';
import AuthHandler from './handler';
import { DITokens } from '../../../../commons/DITokens';

export default function authRoutes(c: DependencyContainer): Router {
  const r = Router();
  const h = c.resolve<AuthHandler>(DITokens.AuthHandler);

  r.post('/login', async (req, res) => h.login(req, res));
  r.post('/logout', async (req, res) => h.logout(req, res));
  r.post('/refresh-token', async (req, res) => h.refreshToken(req, res));

  return r;
}
