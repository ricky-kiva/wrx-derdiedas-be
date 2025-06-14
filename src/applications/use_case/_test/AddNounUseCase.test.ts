/* eslint-disable @typescript-eslint/unbound-method */
import Noun, { NounParams, NounPayload } from '../../../domains/noun/entities/Noun';
import NounRepository from '../../../domains/noun/NounRepository';
import AddNounUseCase from '../AddNounUseCase';

describe('AddNounUseCase', () => {
  it('should orchestrate the action correctly', async () => {
    const useCasePayload: NounPayload = {
      word: 'Katze',
      gender: 'feminine'
    };

    const nounParams: NounParams = {
      ...useCasePayload,
      id: 'noun-123'
    };

    const mockNounEntity = new Noun(nounParams);

    const mockNounRepository: NounRepository = {
      addNoun: jest.fn().mockResolvedValue(mockNounEntity),
      verifyNounAvailability: jest.fn().mockResolvedValue(undefined)
    } as Partial<jest.Mocked<NounRepository>> as NounRepository;

    const addNounUseCase = new AddNounUseCase(mockNounRepository);

    const nounResult = await addNounUseCase.execute(useCasePayload);

    expect(nounResult).toStrictEqual({
      id: nounParams.id,
      word: nounParams.word,
      gender: nounParams.gender
    });

    expect(mockNounRepository.addNoun).toHaveBeenCalledWith(useCasePayload);
    expect(mockNounRepository.verifyNounAvailability).toHaveBeenCalledWith(useCasePayload.word);
  });
});
