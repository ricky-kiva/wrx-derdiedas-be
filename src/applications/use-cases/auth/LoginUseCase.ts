import UserRepository from '../../../domains/user/UserRepository';
import GoogleAuthService from '../../ports/auth/GoogleAuthService';
import { LoginDTO } from './dto/LoginDTO';
import IssueTokenUseCase from './token/issue/IssueTokenUseCase';

export default class LoginUseCase {
  constructor(
    private readonly googleAuthService: GoogleAuthService,
    private readonly issueTokenUseCase: IssueTokenUseCase,
    private readonly userRepository: UserRepository
  ) {}

  async execute(googleIdToken: string): Promise<LoginDTO> {
    const googleUser = await this.googleAuthService.verifyIdToken(googleIdToken);
    const { googleId, email, name, picture } = googleUser;

    let user = await this.userRepository.findByGoogleId(googleId);

    if (!user) {
      user = await this.userRepository.create({ name, googleId, email, picture });
    }

    return {
      jwt: await this.issueTokenUseCase.execute({ userId: user.id }),
      user: { id: user.id, email, name }
    } satisfies LoginDTO;
  }
}
