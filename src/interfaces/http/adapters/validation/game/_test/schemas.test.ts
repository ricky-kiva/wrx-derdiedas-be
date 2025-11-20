import {
  EndGamePayloadSchema,
  GameIdParamSchema,
  SubmitAnswerPayloadSchema,
  UpdateGamePayloadSchema
} from '../schemas';
import { GENDER_VALUES } from '../../../../../../domains/noun/entities/Noun';

describe('GameIdParamSchema', () => {
  it('passes with valid id', () => {
    const result = GameIdParamSchema.safeParse({ id: 'game-123' });
    expect(result.success).toBe(true);
  });

  it('fails when id is empty', () => {
    const result = GameIdParamSchema.safeParse({ id: '' });
    expect(result.success).toBe(false);
  });
});

describe('EndGamePayloadSchema', () => {
  it('passes with name provided', () => {
    const result = EndGamePayloadSchema.safeParse({ name: 'Rickyslash' });
    expect(result.success).toBe(true);
  });

  it('passes when name is omitted', () => {
    const result = EndGamePayloadSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it('fails when name is wrong type', () => {
    const result = EndGamePayloadSchema.safeParse({ name: 123 });
    expect(result.success).toBe(false);
  });
});

describe('SubmitAnswerPayloadSchema', () => {
  it('passes with valid payload', () => {
    const payload = {
      nounId: 'noun-456',
      answer: GENDER_VALUES[0]
    };

    const result = SubmitAnswerPayloadSchema.safeParse(payload);
    expect(result.success).toBe(true);
  });

  it('fails when answer is invalid', () => {
    const payload = {
      nounId: 'noun-456',
      answer: 'invalid-gender'
    };

    const result = SubmitAnswerPayloadSchema.safeParse(payload);
    expect(result.success).toBe(false);
  });

  it('fails when nounId is empty', () => {
    const payload = {
      nounId: '',
      answer: GENDER_VALUES[0]
    };

    const result = SubmitAnswerPayloadSchema.safeParse(payload);
    expect(result.success).toBe(false);
  });
});

describe('UpdateGamePayloadSchema', () => {
  it('passes with userId provided', () => {
    const result = UpdateGamePayloadSchema.safeParse({ userId: 'user-123' });
    expect(result.success).toBe(true);
  });

  it('passes with empty payload', () => {
    const result = UpdateGamePayloadSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it('fails when userId is wrong type', () => {
    const result = UpdateGamePayloadSchema.safeParse({ userId: 123 });
    expect(result.success).toBe(false);
  });
});
