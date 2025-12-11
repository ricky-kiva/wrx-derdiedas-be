import GameTokenManager from '../../../../ports/security/GameTokenManager';
import IssueGameTokenUseCase from '../IssueGameTokenUseCase';

describe('IssueGameTokenUseCase', () => {
  let mockGameTokenManager: jest.Mocked<GameTokenManager>;
  let issueGameTokenUseCase: IssueGameTokenUseCase;
  let mockGAToken: jest.Mock;

  beforeEach(() => {
    mockGAToken = jest.fn();

    mockGameTokenManager = {
      generateAccessToken: mockGAToken
    } as unknown as jest.Mocked<GameTokenManager>;

    issueGameTokenUseCase = new IssueGameTokenUseCase(mockGameTokenManager);
  });

  it('should generate an access token with a jti payload', () => {
    const fakeToken = 'fake.jwt.token';
    mockGameTokenManager.generateAccessToken.mockReturnValue(fakeToken);

    const result = issueGameTokenUseCase.execute();

    expect(mockGAToken).toHaveBeenCalledWith(
      expect.objectContaining({ jti: expect.any(String) as unknown as string })
    );
    expect(result).toBe(fakeToken);
  });
});
