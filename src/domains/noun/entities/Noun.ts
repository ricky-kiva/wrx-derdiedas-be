export const GENDER_VALUES = ['masculine', 'feminine', 'neuter'] as const;

export type Gender = typeof GENDER_VALUES[number];

export interface NounPayload {
    id: string,
    word: string,
    gender: Gender
}

export default class Noun {
    public readonly id: string;
    public word: string;
    public gender: Gender;

    constructor(payload: NounPayload) {
        const { id, word, gender } = payload;

        this.id = id;
        this.word = word;
        this.gender = gender;
    }
}
