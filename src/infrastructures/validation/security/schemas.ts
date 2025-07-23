import z from 'zod';
import JwtPayloadDTO from '../../../applications/ports/security/dto/JwtPayloadDTO';

export const JwtPayloadDTOSchema = z.object({
  userId: z.string()
}) satisfies z.ZodType<JwtPayloadDTO>;
