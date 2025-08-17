import { NounRawDTO } from './dto/NounRawDTO';

export default interface NounQueryRepository {
  getRawAll(): Promise<NounRawDTO[]>;
}
