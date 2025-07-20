import { JwtPayloadDTOSchema } from '../schemas';

describe('JwtPayloadDTOSchema', () => {
  it('should validate a valid payload', () => {
    const payload = {
      userId: 'user-123',
      name: 'Rickyslash'
    };

    const result = JwtPayloadDTOSchema.safeParse(payload);
    
    expect(result.success).toBe(true);
  });

  it('should reject missing fields', () => {
    const payload = {
      userId: 'user-123'
    };

    const result = JwtPayloadDTOSchema.safeParse(payload);

    expect(result.success).toBe(false);
  });

  it('should reject invalid field types', () => {
    const payload = {
      userId: 123,
      name: true
    };

    const result = JwtPayloadDTOSchema.safeParse(payload);

    expect(result.success).toBe(false);
  });
});
