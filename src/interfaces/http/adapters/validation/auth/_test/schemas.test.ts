import { LoginPayloadSchema, LogoutPayloadSchema } from '../schemas';

describe('Auth Schemas', () => {
  describe('LoginPayloadSchema', () => {
    it('should pass valid payload', () => {
      const payload = {
        googleIdToken: 'google.valid.token',
        name: 'Rickyslash'
      };

      const result = LoginPayloadSchema.safeParse(payload);

      expect(result.success).toBe(true);
    });

    it('should fail if googleIdToken is empty', () => {
      const payload = {
        googleIdToken: '',
        name: 'Rickyslash'
      };

      const result = LoginPayloadSchema.safeParse(payload);

      expect(result.success).toBe(false);
    });

    it('should fail if googleIdToken is missing', () => {
      const payload = { name: 'Rickyslash' };

      const result = LoginPayloadSchema.safeParse(payload);

      expect(result.success).toBe(false);
    });
  });

  describe('LogoutPayloadSchema', () => {
    const id = '0123456789abcdef01234567';

    it('passes with valid id', () => {
      const payload = { id };

      const result = LogoutPayloadSchema.safeParse(payload);

      expect(result.success).toBe(true);
    });

    it('fails when id is missing', () => {
      const result = LogoutPayloadSchema.safeParse({});
      expect(result.success).toBe(false);
    });

    it('fails when id is an empty string', () => {
      const payload = { id: '' };
      
      const result = LogoutPayloadSchema.safeParse(payload);

      expect(result.success).toBe(false);
    });
  });
});
