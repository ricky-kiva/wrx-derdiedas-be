/* eslint-disable @typescript-eslint/unbound-method */
import { Gender } from '../../../domains/noun/entities/Noun';
import NounRepository from '../../../domains/noun/NounRepository';
import GetGenderByWordUseCase from '../GetGenderByWordUseCase';

describe('GetGenderByWordUseCase', () => {
  it('should orchestrate the action correctly', async () => {
    const word = 'Katze';
    const gender: Gender = 'feminine';

    const mockNounRepository: NounRepository = {
      getGenderByWord: jest.fn().mockResolvedValue(gender),
      verifyNounAvailability: jest.fn().mockResolvedValue(undefined)
    } as Partial<jest.Mocked<NounRepository>> as NounRepository;

    const getGenderByWordUseCase = new GetGenderByWordUseCase(mockNounRepository);

    const genderResult = await getGenderByWordUseCase.execute(word);

    expect(genderResult).toStrictEqual(gender);

    expect(mockNounRepository.getGenderByWord).toHaveBeenCalledWith(word);
    expect(mockNounRepository.verifyNounAvailability).toHaveBeenCalledWith(word);
  });
});
