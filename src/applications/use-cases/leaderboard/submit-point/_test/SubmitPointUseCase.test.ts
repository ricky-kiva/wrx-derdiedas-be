import UserRepository from '../../../../../domains/user/UserRepository';
import { UserPointPayload } from '../../../../../domains/userPoint/entities/UserPoint';
import UserPointRepository from '../../../../../domains/userPoint/UserPointRepository';
import SubmitPointCmd from '../command/SubmitPointCmd';
import SubmitPointUseCase from '../SubmitPointUseCase';

describe('SubmitPointUseCase', () => {
  const point = 100;

  const mockFBIdMethod = jest.fn();
  const mockCreateMethod = jest.fn();

  const mockUserRepository: jest.Mocked<UserRepository> = {
    create: mockCreateMethod,
    findById: mockFBIdMethod
  } as Partial<jest.Mocked<UserRepository>> as jest.Mocked<UserRepository>;

  const mockSaveMethod = jest.fn();

  const mockUserPointRepository: jest.Mocked<UserPointRepository> = {
    save: mockSaveMethod
  } as Partial<jest.Mocked<UserPointRepository>> as jest.Mocked<UserPointRepository>;

  const submitPointUseCase = new SubmitPointUseCase(mockUserRepository, mockUserPointRepository);

  const fixedDate = new Date();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('submits point for authenticated user', async () => {
    const fakeRegisteredUser = { id: 'user-123', name: 'Rickyslash', googleId: 'g-123' };

    mockUserRepository.findById.mockResolvedValue(fakeRegisteredUser);

    const useCaseReq: SubmitPointCmd = {
      point,
      updatedAt: fixedDate,
      userId: fakeRegisteredUser.id
    };

    const result = await submitPointUseCase.execute(useCaseReq);

    expect(mockFBIdMethod).toHaveBeenCalledWith(fakeRegisteredUser.id);
    expect(mockSaveMethod).toHaveBeenCalledWith({
      point,
      updatedAt: fixedDate,
      userId: fakeRegisteredUser.id
    });

    expect(result).toBe(fakeRegisteredUser.id);
  });

  it('submits point for anonymous user', async () => {
    const fakeAnonymUser = { id: 'user-123', name: 'Rickyslash' };

    mockUserRepository.create.mockResolvedValue(fakeAnonymUser);

    const useCaseReq: SubmitPointCmd = {
      point,
      updatedAt: fixedDate,
      name: fakeAnonymUser.name
    };

    const result = await submitPointUseCase.execute(useCaseReq);

    expect(mockCreateMethod).toHaveBeenCalledWith({ name: fakeAnonymUser.name });
    expect(mockSaveMethod).toHaveBeenCalledWith({
      point,
      updatedAt: fixedDate,
      userId: fakeAnonymUser.id
    } satisfies UserPointPayload);

    expect(result).toBe(fakeAnonymUser.id);
  });
});
