import { inject, injectable } from 'tsyringe';
import { DITokens } from '../../../../commons/DITokens';
import LoginUseCase from '../../../../applications/use-cases/auth/LoginUseCase';
import { Request, Response } from 'express';
import ApiResponse from '../../types/ApiResponse';
import { CookieRequest, LoginPayload, LogoutPayload } from '../../adapters/validation/auth/types';
import LogoutUseCase from '../../../../applications/use-cases/auth/LogoutUseCase';
import RefreshTokenUseCase from '../../../../applications/use-cases/auth/token/refresh-token/RefreshTokenUseCase';
import { LoginPayloadSchema, LogoutPayloadSchema, RefreshTokenPayloadSchema } from '../../adapters/validation/auth/schemas';
import config from '../../../../commons/config';

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

    const { jwt, user } = await this.loginUseCase.execute(googleIdToken);

    res
      .cookie('refreshToken', jwt.refreshToken, {
        httpOnly: true,
        secure: config.env.production ? true : false,
        sameSite: 'strict',
        path: '/auth/refresh-token/'
      })
      .json({
        status: 'success',
        data: { accessToken: jwt.accessToken, user }
      } satisfies ApiResponse);
  }

  async logout(req: Request<unknown, unknown, LogoutPayload>, res: Response) {
    const { id: userId } = LogoutPayloadSchema.parse(req.body);

    await this.logoutUseCase.execute(userId);

    res
      .clearCookie('refreshToken', {
        httpOnly: true,
        secure: config.env.production ? true : false,
        sameSite: 'strict',
        path: '/auth/refresh-token'
      })
      .status(204)
      .send();
  }

  async refreshToken(req: CookieRequest, res: Response) {
    const cookiesRefreshToken = req.cookies.refreshToken;

    if (!cookiesRefreshToken) {
      res.json({
        status: 'fail',
        message: 'No refresh token'
      } satisfies ApiResponse);
      
      return;
    }

    const { refreshToken } = RefreshTokenPayloadSchema.parse({
      refreshToken: cookiesRefreshToken
    });

    const newTokens = await this.refreshTokenUseCase.execute(refreshToken);

    if (!newTokens) {
      res.json({
        status: 'fail',
        message: 'Refresh token is invalid'
      } satisfies ApiResponse);

      return;
    }

    res
      .cookie('refreshToken', newTokens.refreshToken, {
        httpOnly: true,
        secure: config.env.production ? true : false,
        sameSite: 'strict',
        path: '/auth/refresh-token/'
      })
      .json({
        status: 'success',
        data: { accessToken: newTokens.accessToken }
      } satisfies ApiResponse);
  }
}
