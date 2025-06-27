import { inject, injectable } from 'tsyringe';
import SearchNounUseCase from '../../../../applications/use_case/SearchNounUseCase';
import { Request, Response } from 'express';
import { SearchNounPayload } from '../../adapters/validation/searchNoun/types';
import { DITokens } from '../../../../commons/DITokens';

@injectable()
export default class SearchNounHandler {
  constructor(
    @inject(DITokens.SearchNounUseCase) 
    private readonly searchNounUseCase: SearchNounUseCase
  ) {
    this.searchNoun = this.searchNoun.bind(this);
  }

  searchNoun(req: Request<unknown, unknown, SearchNounPayload>, res: Response) {
    const { word } = req.body;
    
    const results = this.searchNounUseCase.execute(word);

    res.json(results);
  }
}
