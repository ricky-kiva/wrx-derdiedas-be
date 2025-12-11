import { Router } from 'express';
import { DependencyContainer } from 'tsyringe';
import UserHandler from './handler';
import { DITokens } from '../../../../commons/DITokens';

export default function userRoutes(c: DependencyContainer): Router {
  const r = Router();
  const h = c.resolve<UserHandler>(DITokens.UserHandler);

  r.get('/:id/points', (req, res) => h.getPoint(req, res));
  r.patch('/me', (req, res) => h.update(req, res));
  r.delete('/me', (req, res) => h.delete(req, res));

  return r;
}
