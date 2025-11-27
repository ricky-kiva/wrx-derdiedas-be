import { GetLeaderboardQPSchema, SubmitPointPayloadSchema } from '../schemas';

describe('GetLeaderboardQPSchema', () => {
  it('should pass with valid page and limit', () => {
    const query = { page: '2', limit: '20' };
    const result = GetLeaderboardQPSchema.safeParse(query);

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.page).toBe(2);
      expect(result.data.limit).toBe(20);
    }
  });

  it('should use default when limit is missing', () => {
    const query = { page: '1' };
    const result = GetLeaderboardQPSchema.safeParse(query);

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.page).toBe(1);
      expect(result.data.limit).toBe(25);
    }
  });

  it('should fail if page is not a number', () => {
    const query = { page: 'abc', limit: '10' };
    const result = GetLeaderboardQPSchema.safeParse(query);

    expect(result.success).toBe(false);
  });

  it('should clamp limit to minimum 10', () => {
    const query = { page: '1', limit: '5' };
    const result = GetLeaderboardQPSchema.safeParse(query);

    expect(result.success).toBe(true);
    if (result.success) expect(result.data.limit).toBe(10);
  });

  it('should clamp limit to maximum 150', () => {
    const query = { page: '1', limit: '500' };
    const result = GetLeaderboardQPSchema.safeParse(query);

    expect(result.success).toBe(true);
    if (result.success) expect(result.data.limit).toBe(150);
  });
});

describe('SubmitPointPayloadSchema', () => {
  it('should pass with valid payload (anonymous)', () => {
    const payload = {
      name: 'Rickyslash',
      point: 10,
      updatedAt: new Date().toISOString()
    };

    const result = SubmitPointPayloadSchema.safeParse(payload);

    expect(result.success).toBe(true);
    
    if (result.success) {
      expect(result.data.point).toBe(10);
      expect(result.data.name).toBe('Rickyslash');
      expect(result.data.updatedAt).toBeInstanceOf(Date);
    }
  });

  it('should default point to 10 if not provided', () => {
    const payload = {
      name: 'Anonymous',
      updatedAt: new Date().toISOString()
    };

    const result = SubmitPointPayloadSchema.safeParse(payload);

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.point).toBe(10);
    }
  });

  it('should pass with valid payload (registered user)', () => {
    const payload = {
      userId: 'user-123',
      point: 10,
      updatedAt: new Date()
    };

    const result = SubmitPointPayloadSchema.safeParse(payload);

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.userId).toBe('user-123');
      expect(result.data.point).toBe(10);
      expect(result.data.updatedAt).toBeInstanceOf(Date);
    }
  });

  it('should fail if updatedAt is missing', () => {
    const payload = { name: 'Rickyslash', point: 10 };

    const result = SubmitPointPayloadSchema.safeParse(payload);

    expect(result.success).toBe(false);
  });

  it('should fail if point is not a number', () => {
    const payload = {
      name: 'Rickyslash',
      point: 'abc',
      updatedAt: new Date().toISOString()
    };

    const result = SubmitPointPayloadSchema.safeParse(payload);

    expect(result.success).toBe(false);
  });
});
