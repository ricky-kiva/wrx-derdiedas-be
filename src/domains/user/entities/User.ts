export interface UserPayload {
  name: string,
  googleId?: string,
  email?: string,
  picture?: string
}

export interface UserParams extends UserPayload {
  id: string
}

export default class User {
  public readonly id: string;
  public name: string;
  public googleId?: string;
  public email?: string;
  public picture?: string;

  constructor(params: UserParams) {
    const { id, name, googleId, email, picture } = params;

    this.id = id;
    this.name = name;
    this.googleId = googleId;
    this.email = email;
    this.picture = picture;
  }
}
