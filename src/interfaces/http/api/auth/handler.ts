import { inject, injectable } from 'tsyringe';
import { DITokens } from '../../../../commons/DITokens';
import LoginUseCase from '../../../../applications/use-cases/auth/LoginUseCase';
import { Request, Response } from 'express';
import ApiResponse from '../../types/ApiResponse';
import { LoginPayload, LogoutPayload, RefreshTokenPayload } from '../../adapters/validation/auth/types';
import LogoutUseCase from '../../../../applications/use-cases/auth/LogoutUseCase';
import RefreshTokenUseCase from '../../../../applications/use-cases/auth/token/refresh-token/RefreshTokenUseCase';
import { LoginPayloadSchema, LogoutPayloadSchema, RefreshTokenPayloadSchema } from '../../adapters/validation/auth/schemas';

@injectable()
export default class AuthHandler {
  constructor(
    @inject(DITokens.LoginUseCase) 
    private readonly loginUseCase: LoginUseCase,
    @inject(DITokens.LogoutUseCase)
    private readonly logoutUseCase: LogoutUseCase,
    @inject(DITokens.RefreshTokenUseCase)
    private readonly refreshTokenUseCase: RefreshTokenUseCase
  ) {
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.refreshToken = this.refreshToken.bind(this);
  }

  async login(req: Request<unknown, unknown, LoginPayload>, res: Response) {
    const { googleIdToken } = LoginPayloadSchema.parse(req.body);

    const token = await this.loginUseCase.execute(googleIdToken);

    res.json({
      status: 'success',
      data: token
    } satisfies ApiResponse);
  }

  async logout(req: Request<unknown, unknown, LogoutPayload>, res: Response) {
    const { id: userId } = LogoutPayloadSchema.parse(req.body);

    await this.logoutUseCase.execute(userId);

    res.sendStatus(401);
  }

  async refreshToken(req: Request<unknown, unknown, RefreshTokenPayload>, res: Response) {
    const { refreshToken } = RefreshTokenPayloadSchema.parse(req.body);

    const newTokens = await this.refreshTokenUseCase.execute(refreshToken);

    res.json({
      status: 'success',
      data: newTokens
    } satisfies ApiResponse);
  }
}
