import { Router } from 'express';
import { DependencyContainer } from 'tsyringe';
import LoginHandler from './handler';
import { DITokens } from '../../../../commons/DITokens';
import zodParser from '../../middlewares/validation/zodParser';
import { LoginPayloadSchema } from '../../adapters/validation/auth/schemas';

export default function loginRoutes(c: DependencyContainer): Router {
  const r = Router();
  const h = c.resolve<LoginHandler>(DITokens.LoginHandler);

  r.post('/login', zodParser(LoginPayloadSchema), async (req, res) => h.login(req, res));

  return r;
}
