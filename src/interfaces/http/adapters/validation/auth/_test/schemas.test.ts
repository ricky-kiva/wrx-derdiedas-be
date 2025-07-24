import { LoginPayloadSchema } from '../schemas';

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
    const payload = {
      name: 'Rickyslash'
    };

    const result = LoginPayloadSchema.safeParse(payload);

    expect(result.success).toBe(false);
  });

  it('should fail if name is empty', () => {
    const payload = {
      googleIdToken: 'valid-token',
      name: ''
    };

    const result = LoginPayloadSchema.safeParse(payload);

    expect(result.success).toBe(false);
  });

  it('should fail if name is missing', () => {
    const payload = {
      googleIdToken: 'valid-token'
    };

    const result = LoginPayloadSchema.safeParse(payload);
    
    expect(result.success).toBe(false);
  });
});
