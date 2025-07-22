import JwtPayloadDTO from '../../../applications/ports/security/dto/JwtPayloadDTO';
import { JwtPayloadDTOSchema } from './schemas';

export function isJwtPayloadDTO(obj: unknown): obj is JwtPayloadDTO {
  return JwtPayloadDTOSchema.safeParse(obj).success;
}
