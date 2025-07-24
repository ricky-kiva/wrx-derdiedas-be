import { inject, injectable } from 'tsyringe';
import { DITokens } from '../../../../../commons/DITokens';
import LoginUseCase from '../../../../../applications/use-cases/auth/LoginUseCase';
import { LoginPayload } from '../../../adapters/validation/search/types';
import { Request, Response } from 'express';
import ApiResponse from '../../../types/ApiResponse';

@injectable()
export default class LoginHandler {
  constructor(
    @inject(DITokens.LoginUseCase) 
    private readonly loginUseCase: LoginUseCase
  ) {
    this.login = this.login.bind(this);
  }

  async login(req: Request<unknown, unknown, LoginPayload>, res: Response) {
    const { googleIdToken, name } = req.body;

    const token = await this.loginUseCase.execute(googleIdToken, name);

    res.json({
      status: 'success',
      data: token
    } satisfies ApiResponse);
  }
}
