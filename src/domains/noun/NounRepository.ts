import { NounRaw } from './entities/Noun';

export default interface NounRepository {
  getRawAll(): Promise<NounRaw[]>;
}
