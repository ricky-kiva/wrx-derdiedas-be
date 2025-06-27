import { SearchNounPayloadSchema } from '../schemas';

describe('SearchNounPayloadSchema', () => {
  it('should pass valid word', () => {
    const payload = { word: 'Katze' };
    const result = SearchNounPayloadSchema.safeParse(payload);
    
    expect(result.success).toBe(true);
  });

  it('should fail if word is empty', () => {
    const payload = { word: '' };
    const result = SearchNounPayloadSchema.safeParse(payload);
    
    expect(result.success).toBe(false);
  });

  it('should fail if word is missing', () => {
    const result = SearchNounPayloadSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});
