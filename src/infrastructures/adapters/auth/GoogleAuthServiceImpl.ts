import { OAuth2Client } from 'google-auth-library';
import GoogleUserDTO from '../../../applications/ports/auth/dto/GoogleUserDTO';
import GoogleAuthService from '../../../applications/ports/auth/GoogleAuthService';
import config from '../../../commons/config';
import { AuthenticationError } from '../../../commons/exceptions';
import { randomAnimalName } from '../../../commons/utils/randomAnimalName';

export default class GoogleAuthServiceImpl implements GoogleAuthService {
  private client = new OAuth2Client(config.clientId.google);
  
  async verifyIdToken(idToken: string): Promise<GoogleUserDTO> {
    const ticket = await this.client.verifyIdToken({
      idToken,
      audience: config.clientId.google
    });

    const payload = ticket.getPayload();

    if (!payload) throw new AuthenticationError('Invalid google token');

    return {
      googleId: payload.sub,
      email: payload.email ?? '',
      name: payload.name ?? randomAnimalName(),
      picture: payload.picture ?? ''
    } satisfies GoogleUserDTO;
  }
};
