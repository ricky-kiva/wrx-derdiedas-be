import { inject, injectable } from 'tsyringe';
import { DITokens } from '../../../commons/DITokens';
import TokenManager from '../../../applications/ports/security/TokenManager';
import { Request } from 'express';
import { AuthenticationError } from '../../../commons/exceptions';

@injectable()
export default class HeaderUtils {
  constructor(
    @inject(DITokens.TokenManager)
    private readonly tokenManager: TokenManager
  ) {}

  extractUserId(req: Request): string | undefined {
    const authHeader = req.headers.authorization;

    if (!authHeader) return undefined;

    const token = authHeader.split(' ')[1];

    if (!token) return undefined;

    try {
      const payload = this.tokenManager.decodePayload(token);
      return payload.userId;
    } catch {
      throw new AuthenticationError("Invalid or expired token");
    }
  }
}
