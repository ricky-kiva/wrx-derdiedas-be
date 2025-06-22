import WordNormalizerService from '../../../applications/ports/search/WordNormalizerService';

export default class WordNormalizerServiceImpl implements WordNormalizerService {
  normalize(word: string): string {
    return word
      .toLowerCase()
      .replace(/ä/g, 'a')
      .replace(/ö/g, 'o')
      .replace(/ü/g, 'u')
      .replace(/ß/g, 'ss');
  }
}
