import { Gender } from '../../domains/noun/entities/Noun';
import NounRepository from '../../domains/noun/NounRepository';

export default class GetGenderByWordUseCase {
  constructor(private readonly nounRepository: NounRepository) {};

  async execute(word: string): Promise<Gender> {
    await this.nounRepository.verifyNounAvailability(word);
    return await this.nounRepository.getGenderByWord(word);
  }
}
