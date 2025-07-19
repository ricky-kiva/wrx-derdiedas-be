import TokenStore from '../ports/security/TokenStore';

export default class LogoutUseCase {
  constructor(private readonly tokenStore: TokenStore) {}

  async execute(userId: string): Promise<void> {
    await this.tokenStore.deleteRefreshToken(userId);
  }
}
