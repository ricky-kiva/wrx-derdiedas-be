export const GENDER_VALUES = ['masculine', 'feminine', 'neuter'] as const;

export type Gender = typeof GENDER_VALUES[number];

export interface NounPayload {
  word: string,
  gender: Gender,
  meanings: string[]
}

export interface NounParams extends NounPayload {
  id: string
}

export interface NounRaw extends NounParams {
  normalized: string
}

export default class Noun {
  public readonly id: string;
  public word: string;
  public gender: Gender;
  public meanings: string[];

  constructor(params: NounParams) {
    const { id, word, gender, meanings } = params;

    this.id = id;
    this.word = word;
    this.gender = gender;
    this.meanings = meanings;
  }
}
