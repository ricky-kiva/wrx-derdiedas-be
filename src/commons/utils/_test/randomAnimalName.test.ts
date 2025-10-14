import { randomAnimalName } from '../randomAnimalName';

describe('randomAnimalName', () => {
  it('should return a string containing one element and one animal name', () => {
    const result = randomAnimalName();

    expect(typeof result).toBe('string');
    expect(result).toMatch(/^[A-Z][a-z]+ [A-Z]/);
  });

  it('should return different results occasionally', () => {
    jest.spyOn(Math, 'random')
      .mockReturnValueOnce(0.1)
      .mockReturnValueOnce(0.5);

    const result = randomAnimalName();

    expect(result).toMatch(/^[A-Za-z ]+ [A-Za-z ]+$/);

    jest.restoreAllMocks();
  });
});
