import { inject, injectable } from 'tsyringe';
import SearchNounUseCase from '../../../../applications/use-cases/noun/search/SearchNounUseCase';
import { Request, Response } from 'express';
import { SearchNounPayload } from '../../adapters/validation/search/types';
import { DITokens } from '../../../../commons/DITokens';
import ApiResponse from '../../types/ApiResponse';

@injectable()
export default class SearchHandler {
  constructor(
    @inject(DITokens.SearchNounUseCase) 
    private readonly searchNounUseCase: SearchNounUseCase
  ) {
    this.searchNoun = this.searchNoun.bind(this);
  }

  searchNoun(req: Request<unknown, unknown, SearchNounPayload>, res: Response) {
    const { word } = req.body;
    
    const results = this.searchNounUseCase.execute(word);

    res.json({
      status: 'success',
      data: results
    } satisfies ApiResponse);
  }
}
