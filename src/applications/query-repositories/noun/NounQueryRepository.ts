import { NounDTO } from '../../shared/dto/noun/NounDTO';
import { NounRawDTO } from './dto/NounRawDTO';

export default interface NounQueryRepository {
  getRawAll(): Promise<NounRawDTO[]>;
  getRandom(limit?: number): Promise<NounDTO[]>
}
