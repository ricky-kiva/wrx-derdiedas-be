import { NounPayload } from '../../domains/noun/entities/Noun';
import NounRepository from '../../domains/noun/NounRepository';
import { NounDTO } from '../dto/NounDTO';

export default class AddNounUseCase {
  constructor(private readonly nounRepository: NounRepository) {};

  async execute(useCasePayload: NounPayload): Promise<NounDTO> {
    await this.nounRepository.verifyNounAvailability(useCasePayload.word);

    const nounEntity = await this.nounRepository.addNoun(useCasePayload);
    return { ...nounEntity };
  }
}
