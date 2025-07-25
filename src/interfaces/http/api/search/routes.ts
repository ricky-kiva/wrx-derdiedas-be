import { Router } from 'express';
import { DependencyContainer } from 'tsyringe';
import zodParser from '../../middlewares/validation/zodParser';
import { SearchNounPayloadSchema } from '../../adapters/validation/search/schemas';
import SearchHandler from './handler';
import { DITokens } from '../../../../commons/DITokens';

export default function searchNounRoutes(c: DependencyContainer): Router {
  const r = Router();
  const h = c.resolve<SearchHandler>(DITokens.SearchHandler);

  r.post('/', zodParser(SearchNounPayloadSchema), (req, res) => h.searchNoun(req, res));

  return r;
}
