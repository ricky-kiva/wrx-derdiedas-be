import z from 'zod';
import JwtPayloadDTO from '../../../applications/dto/JwtPayloadDTO';

export const JwtPayloadDTOSchema = z.object({
  userId: z.string(),
  name: z.string()
}) satisfies z.ZodType<JwtPayloadDTO>;
