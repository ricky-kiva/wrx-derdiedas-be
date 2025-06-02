export type Gender = 'masculine' | 'feminine' | 'neuter';

export interface NounPayload {
    word: string,
    gender: Gender
}

class Noun {
    public word: string;
    public gender: Gender;

    constructor(payload: NounPayload) {
        const { word, gender } = payload;

        this.word = word;
        this.gender = gender;
    }
}

export default Noun;
