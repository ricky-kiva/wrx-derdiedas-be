import { Gender, NounPayload } from './entities/Noun';

interface NounRepository {
    addNoun(payload: NounPayload): Promise<void>;
    getGenderByWord(word: string): Promise<Gender>;
    verifyNounExist(word: string): Promise<void>;
}

export default NounRepository;
