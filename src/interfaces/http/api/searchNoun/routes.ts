import { Router } from 'express';
import { inject, injectable } from 'tsyringe';
import zodParser from '../../middlewares/validation/zodParser';
import { SearchNounPayloadSchema } from '../../adapters/validation/searchNoun/schemas';
import SearchNounHandler from './handler';
import { DITokens } from '../../../../commons/DITokens';

@injectable()
export default class SearchNounRouter {
  public readonly router: Router;

  constructor(
    @inject(DITokens.SearchNounHandler) private readonly h: SearchNounHandler
  ) {
    this.router = Router();
    
    this.router.post(
      '/', 
      zodParser(SearchNounPayloadSchema), 
      (req, res) => this.h.searchNoun(req, res));
  }
}
