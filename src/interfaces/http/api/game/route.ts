import { Router } from 'express';
import { DependencyContainer } from 'tsyringe';
import GameHandler from './handler';
import { DITokens } from '../../../../commons/DITokens';

export default function gameRoutes(c: DependencyContainer): Router {
  const r = Router();
  const h = c.resolve<GameHandler>(DITokens.GameHandler);

  r.post('/answer', async (req, res) => h.submitAnswer(req, res));
  r.post('/end', async (req, res) => h.endGame(req, res));
  r.post('/start', async (req, res) => h.startGame(req, res));

  return r;
}
