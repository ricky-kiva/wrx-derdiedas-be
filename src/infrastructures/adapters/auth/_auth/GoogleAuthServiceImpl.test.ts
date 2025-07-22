import { LoginTicket } from 'google-auth-library';
import GoogleAuthServiceImpl from '../GoogleAuthServiceImpl';
import { AuthenticationError } from '../../../../commons/exceptions';
import GoogleUserDTO from '../../../../applications/ports/auth/dto/GoogleUserDTO';

const mockVerifyIdTokenMethod = jest.fn();

jest.mock('google-auth-library', () => {
  return {
    OAuth2Client: jest.fn().mockImplementation(() => {
      return { verifyIdToken: mockVerifyIdTokenMethod };
    })
  };
});

describe('GoogleAuthServiceImpl', () => {
  let googleAuthServiceImpl: GoogleAuthServiceImpl;

  const mockPayload = {
    sub: 'google-123456',
    email: 'user@gmail.com',
    name: 'Test User',
    picture: 'http://example.com/pic.jpg'
  };

  beforeEach(() => {
    googleAuthServiceImpl = new GoogleAuthServiceImpl();

    mockVerifyIdTokenMethod.mockReset();
  });

  it('should return GoogleUserDTO when token is valid', async () => {
    const fakeTicket = { getPayload: () => mockPayload } as Partial<LoginTicket>;

    mockVerifyIdTokenMethod.mockResolvedValueOnce(fakeTicket);
    
    const result = await googleAuthServiceImpl.verifyIdToken('some-token');
    
    expect(result).toEqual({
      googleId: mockPayload.sub,
      email: mockPayload.email,
      name: mockPayload.name,
      picture: mockPayload.picture
    } satisfies GoogleUserDTO);
  });

  it('should throw AuthenticationError when payload is null', async () => {
    const fakeTicket = { getPayload: () => null } as unknown as Partial<LoginTicket>;

    mockVerifyIdTokenMethod.mockResolvedValueOnce(fakeTicket);

    await expect(googleAuthServiceImpl.verifyIdToken('some-token'))
      .rejects
      .toThrow(AuthenticationError);
  });
});
