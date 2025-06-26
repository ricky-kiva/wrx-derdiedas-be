import Noun, { Gender, NounPayload, NounRaw } from './entities/Noun';

export default interface NounRepository {
  addNoun(payload: NounPayload): Promise<Noun>;
  getRawAll(): Promise<NounRaw[]>;
  getGenderByWord(word: string): Promise<Gender>;
  verifyNounAvailability(word: string): Promise<void>;
}
