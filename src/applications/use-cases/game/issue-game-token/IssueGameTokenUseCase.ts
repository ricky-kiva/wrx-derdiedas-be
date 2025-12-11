import GameTokenManager from '../../../ports/security/GameTokenManager';

export default class IssueGameTokenUseCase {
  constructor(private readonly gameTokenManager: GameTokenManager) {}

  execute(): string {
    const payload = { jti: crypto.randomUUID() };
    return this.gameTokenManager.generateAccessToken(payload);
  }
}
