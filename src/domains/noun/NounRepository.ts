import Noun, { Gender, NounPayload } from './entities/Noun';

export default interface NounRepository {
    addNoun(payload: NounPayload): Promise<Noun>;
    getGenderByWord(word: string): Promise<Gender>;
    verifyNounExist(word: string): Promise<void>;
}
