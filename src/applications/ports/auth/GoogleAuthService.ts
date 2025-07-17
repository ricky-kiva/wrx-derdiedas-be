import GoogleUserDTO from '../../dto/GoogleUserDTO';

export default interface GoogleAuthService {
  verifyIdToken(idToken: string): Promise<GoogleUserDTO>;
}
