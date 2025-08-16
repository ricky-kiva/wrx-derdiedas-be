import { NounPayload } from './entities/Noun';

export default interface NounRepository {
  insertMany(nouns: NounPayload[]): Promise<void>;
  deleteAll(): Promise<void>;
}
