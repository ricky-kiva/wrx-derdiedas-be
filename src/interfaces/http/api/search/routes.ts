import { Router } from 'express';
import { DependencyContainer } from 'tsyringe';
import SearchHandler from './handler';
import { DITokens } from '../../../../commons/DITokens';

export default function searchNounRoutes(c: DependencyContainer): Router {
  const r = Router();
  const h = c.resolve<SearchHandler>(DITokens.SearchHandler);

  r.post('/', (req, res) => h.searchNoun(req, res));

  return r;
}
