import { GetLeaderboardQuerySchema } from '../schemas';

describe('GetLeaderboardQuerySchema', () => {
  it('should pass with valid page and limit', () => {
    const query = { page: '2', limit: '20' };
    const result = GetLeaderboardQuerySchema.safeParse(query);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.page).toBe(2);
      expect(result.data.limit).toBe(20);
    }
  });

  it('should use default when limit is missing', () => {
    const query = { page: '1' };
    const result = GetLeaderboardQuerySchema.safeParse(query);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.page).toBe(1);
      expect(result.data.limit).toBe(25);
    }
  });

  it('should fail if page is not a number', () => {
    const query = { page: 'abc', limit: '10' };
    const result = GetLeaderboardQuerySchema.safeParse(query);

    expect(result.success).toBe(false);
  });

  it('should fail if limit is less than 1', () => {
    const query = { page: '1', limit: '0' };
    const result = GetLeaderboardQuerySchema.safeParse(query);

    expect(result.success).toBe(false);
  });
});

