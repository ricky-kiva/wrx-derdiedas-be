import { NounPayload, NounRaw } from './entities/Noun';

export default interface NounRepository {
  getRawAll(): Promise<NounRaw[]>;
  insertMany(nouns: NounPayload[]): Promise<void>;
  deleteAll(): Promise<void>;
}
