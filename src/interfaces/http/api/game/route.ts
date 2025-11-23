import { Router } from 'express';
import { DependencyContainer } from 'tsyringe';
import GameHandler from './handler';
import { DITokens } from '../../../../commons/DITokens';

export default function gameRoutes(c: DependencyContainer): Router {
  const r = Router();
  const h = c.resolve<GameHandler>(DITokens.GameHandler);

  r.delete('/:id', async (req, res) => h.delete(req, res));
  r.get('/:id', async (req, res) => h.getById(req, res));
  r.patch('/:id', async (req, res) => h.update(req, res));
  r.post('/:id/answer', async (req, res) => h.submitAnswer(req, res));
  r.post('/:id/end', async (req, res) => h.end(req, res));
  r.post('/start', async (req, res) => h.start(req, res));
  
  return r;
}
