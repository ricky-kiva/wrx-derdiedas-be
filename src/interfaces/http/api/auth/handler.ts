import { inject, injectable } from 'tsyringe';
import { DITokens } from '../../../../commons/DITokens';
import LoginUseCase from '../../../../applications/use-cases/auth/LoginUseCase';
import { Request, Response } from 'express';
import ApiResponse from '../../types/ApiResponse';
import { LoginPayload, LogoutPayload } from '../../adapters/validation/auth/types';
import LogoutUseCase from '../../../../applications/use-cases/auth/LogoutUseCase';

@injectable()
export default class LoginHandler {
  constructor(
    @inject(DITokens.LoginUseCase) 
    private readonly loginUseCase: LoginUseCase,
    @inject(DITokens.LogoutUseCase)
    private readonly logoutUseCase: LogoutUseCase
  ) {
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
  }

  async login(req: Request<unknown, unknown, LoginPayload>, res: Response) {
    const { googleIdToken, name } = req.body;

    const token = await this.loginUseCase.execute(googleIdToken, name);

    res.json({
      status: 'success',
      data: token
    } satisfies ApiResponse);
  }

  async logout(req: Request<unknown, unknown, LogoutPayload>, res: Response): Promise<void> {
    const { id: userId } = req.body;

    if (!userId) {
      res.status(401).json({
        status: 'fail',
        message: 'User is not authenticated'
      } satisfies ApiResponse);
    }

    await this.logoutUseCase.execute(userId);

    res.sendStatus(401);
  }
}
