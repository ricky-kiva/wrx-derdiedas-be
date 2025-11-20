import { 
  UserIdParamSchema,
  UpdateUserPayloadSchema 
} from '../schemas';

describe('User Schemas', () => {
  describe('UserIdParamSchema', () => {
    it('passes with valid id', () => {
      const result = UserIdParamSchema.safeParse({ id: 'user-123' });
      expect(result.success).toBe(true);
    });

    it('fails when id is missing', () => {
      const result = UserIdParamSchema.safeParse({});
      expect(result.success).toBe(false);
    });

    it('fails when id is empty', () => {
      const result = UserIdParamSchema.safeParse({ id: '' });
      expect(result.success).toBe(false);
    });
  });

  describe('UpdateUserPayloadSchema', () => {
    it('passes when name is provided', () => {
      const result = UpdateUserPayloadSchema.safeParse({ name: 'Rickyslash' });
      expect(result.success).toBe(true);
    });

    it('passes when payload is empty (since name is optional)', () => {
      const result = UpdateUserPayloadSchema.safeParse({});
      expect(result.success).toBe(true);
    });

    it('fails when name is empty string', () => {
      const result = UpdateUserPayloadSchema.safeParse({ name: '' });
      expect(result.success).toBe(false);
    });

    it('fails when name is not a string', () => {
      const result = UpdateUserPayloadSchema.safeParse({ name: 123 });
      expect(result.success).toBe(false);
    });
  });
});
