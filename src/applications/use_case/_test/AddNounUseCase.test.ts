/* eslint-disable @typescript-eslint/unbound-method */
import Noun, { NounPayload } from '../../../domains/noun/entities/Noun';
import NounRepository from '../../../domains/noun/NounRepository';
import AddNounUseCase from '../AddNounUseCase';

describe('AddNounUseCase', () => {
  it('should orchestrate the action correctly', async () => {
    const useCasePayload: NounPayload = {
      id: 'noun-123',
      word: 'katze',
      gender: 'feminine'
    };

    const mockNounEntity = new Noun(useCasePayload);

    const mockPartialNounRepository: Partial<jest.Mocked<NounRepository>> = {
      addNoun: jest.fn().mockResolvedValue(mockNounEntity),
      verifyNounAvailability: jest.fn().mockResolvedValue(undefined)
    };

    const mockNounRepository = mockPartialNounRepository as NounRepository;

    const addNounUseCase = new AddNounUseCase(mockNounRepository);

    const nounResult = await addNounUseCase.execute(useCasePayload);

    expect(nounResult).toStrictEqual({
      id: useCasePayload.id,
      word: useCasePayload.word,
      gender: useCasePayload.gender
    });

    expect(mockNounRepository.addNoun).toHaveBeenCalledWith(useCasePayload);
    expect(mockNounRepository.verifyNounAvailability).toHaveBeenCalledWith(useCasePayload.word);
  });
});
