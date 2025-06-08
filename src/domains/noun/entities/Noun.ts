export const GENDER_VALUES = ['masculine', 'feminine', 'neuter'] as const;

export type Gender = typeof GENDER_VALUES[number];

export interface NounPayload {
  word: string,
  gender: Gender
}

export interface NounParams extends NounPayload {
  id: string
}

export default class Noun {
  public readonly id: string;
  public word: string;
  public gender: Gender;

  constructor(params: NounParams) {
    const { id, word, gender } = params;

    this.id = id;
    this.word = word;
    this.gender = gender;
  }
}
