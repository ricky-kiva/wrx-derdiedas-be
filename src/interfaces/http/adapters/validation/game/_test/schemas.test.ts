import { GENDER_VALUES } from '../../../../../../domains/noun/entities/Noun';
import { SubmitAnswerPayloadSchema } from '../schemas';

describe('SubmitAnswerPayloadSchema', () => {
  it('should pass with valid payload', () => {
    const payload = {
      gameId: 'game-123',
      nounId: 'noun-456',
      answer: 'masculine',
      userId: 'user-789',
    };

    const result = SubmitAnswerPayloadSchema.safeParse(payload);

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.gameId).toBe('game-123');
      expect(result.data.answer).toBe('masculine');
    }
  });

  it('should fail if answer is not in GENDER_VALUES', () => {
    const payload = {
      gameId: 'game-123',
      nounId: 'noun-456',
      answer: 'invalid-gender',
    };

    const result = SubmitAnswerPayloadSchema.safeParse(payload);
    expect(result.success).toBe(false);
  });

  it('should fail if gameId is missing', () => {
    const payload = {
      nounId: 'noun-456',
      answer: 'feminine',
    };

    const result = SubmitAnswerPayloadSchema.safeParse(payload);
    expect(result.success).toBe(false);
  });

  it('should fail if nounId is an empty string', () => {
    const payload = {
      gameId: 'game-123',
      nounId: '',
      answer: 'neuter',
    };

    const result = SubmitAnswerPayloadSchema.safeParse(payload);
    expect(result.success).toBe(false);
  });

  it('should accept payload without userId', () => {
    const payload = {
      gameId: 'game-123',
      nounId: 'noun-456',
      answer: 'feminine',
    };

    const result = SubmitAnswerPayloadSchema.safeParse(payload);
    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.userId).toBeUndefined();
      expect(GENDER_VALUES).toContain(result.data.answer);
    }
  });
});
