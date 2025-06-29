import { Router } from 'express';
import { DependencyContainer } from 'tsyringe';
import zodParser from '../../middlewares/validation/zodParser';
import { SearchNounPayloadSchema } from '../../adapters/validation/searchNoun/schemas';
import SearchNounHandler from './handler';
import { DITokens } from '../../../../commons/DITokens';

export default function searchNounRoutes(c: DependencyContainer): Router {
  const r = Router();
  const h = c.resolve<SearchNounHandler>(DITokens.SearchNounHandler);

  r.post('/', zodParser(SearchNounPayloadSchema), (req, res) => h.searchNoun(req, res));

  return r;
}
