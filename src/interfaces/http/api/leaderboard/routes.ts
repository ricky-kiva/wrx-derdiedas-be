import { Router } from 'express';
import { DependencyContainer } from 'tsyringe';
import LeaderboardHandler from './handler';
import { DITokens } from '../../../../commons/DITokens';

export default function leaderboardRoutes(c: DependencyContainer): Router {
  const r = Router();
  const h = c.resolve<LeaderboardHandler>(DITokens.LeaderboardHandler);

  r.get('/', async (req, res) => h.getLeaderboard(req, res));
  r.post('/', async (req, res) => h.submitPoint(req, res));

  return r;
}
