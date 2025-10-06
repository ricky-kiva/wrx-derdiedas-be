import z from 'zod';
import { SubmitAnswerPayloadSchema } from './schemas';

export type SubmitAnswerPayload = z.infer<typeof SubmitAnswerPayloadSchema>;
