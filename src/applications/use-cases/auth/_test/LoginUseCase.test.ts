import User from '../../../../domains/user/entities/User';
import UserRepository from '../../../../domains/user/UserRepository';
import GoogleUserDTO from '../../../ports/auth/dto/GoogleUserDTO';
import GoogleAuthService from '../../../ports/auth/GoogleAuthService';
import JwtPayloadDTO from '../../../ports/security/dto/JwtPayloadDTO';
import JwtTokenDTO from '../../../ports/security/dto/JwtTokenDTO';
import LoginUseCase from '../LoginUseCase';
import IssueTokenUseCase from '../token/issue/IssueTokenUseCase';

describe('LoginUseCase', () => {
  const fakeGoogleIdToken = 'fake.google.id.token';
  const mockUserName = 'Rickyslash';

  const mockGoogleUser: GoogleUserDTO = {
    googleId: 'g-123',
    email: 'r@gmail.com',
    picture: 'http://some-url/p.jpg'
  };

  const mockCreatedUser: User = { 
    id: 'user-123', 
    name: mockUserName, 
    ...mockGoogleUser 
  };

  const mockIssuedToken: JwtTokenDTO = {
    accessToken: 'issued.access.token',
    refreshToken: 'issued.refresh.token'
  };

  const mockGASverifyIdToken = jest.fn();
  
  const mockGoogleAuthService: jest.Mocked<GoogleAuthService> = {
    verifyIdToken: mockGASverifyIdToken
  } as Partial<GoogleAuthService> as jest.Mocked<GoogleAuthService>;

  const mockURCreate = jest.fn();
  const mockURfindByGoogleId = jest.fn();

  const mockUserRepository: jest.Mocked<UserRepository> = {
    create: mockURCreate,
    findByGoogleId: mockURfindByGoogleId,
  } as Partial<UserRepository> as jest.Mocked<UserRepository>;

  const mockITUCExecute = jest.fn();

  const mockIssueTokenUseCase: jest.Mocked<IssueTokenUseCase> = {
    execute: mockITUCExecute
  } as Partial<IssueTokenUseCase> as jest.Mocked<IssueTokenUseCase>;

  const loginUseCase = new LoginUseCase(
    mockGoogleAuthService,
    mockIssueTokenUseCase,
    mockUserRepository
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('registers new user & returns JWT tokens', async () => {
    mockGoogleAuthService.verifyIdToken.mockResolvedValue(mockGoogleUser);
    mockUserRepository.findByGoogleId.mockResolvedValue(null);
    mockUserRepository.create.mockResolvedValue(mockCreatedUser);
    mockIssueTokenUseCase.execute.mockResolvedValue(mockIssuedToken);

    const result = await loginUseCase.execute(fakeGoogleIdToken, mockUserName);

    expect(mockGASverifyIdToken).toHaveBeenCalledWith(fakeGoogleIdToken);
    expect(mockURfindByGoogleId).toHaveBeenCalledWith(mockGoogleUser.googleId);
    expect(mockURCreate).toHaveBeenCalledWith({ name: mockUserName, ...mockGoogleUser });
    expect(mockITUCExecute).toHaveBeenCalledWith({ userId: mockCreatedUser.id } satisfies JwtPayloadDTO);
    expect(result).toEqual(mockIssuedToken);
  });

  it('logs-in existing user & returns JWT token', async () => {
    mockGoogleAuthService.verifyIdToken.mockResolvedValue(mockGoogleUser);
    mockUserRepository.findByGoogleId.mockResolvedValue(mockCreatedUser);
    mockIssueTokenUseCase.execute.mockResolvedValue(mockIssuedToken);

    const result = await loginUseCase.execute(fakeGoogleIdToken, mockUserName);

    expect(mockURCreate).not.toHaveBeenCalled();
    expect(mockITUCExecute).toHaveBeenCalledWith({ userId: mockCreatedUser.id } satisfies JwtPayloadDTO);
    expect(result).toEqual(mockIssuedToken);
  });
});
