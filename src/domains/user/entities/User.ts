export interface UserPayload {
  username: string,
  googleId?: string,
  email?: string,
  picture?: string
}

export interface UserParams extends UserPayload {
  id: string
}

export default class User {
  public readonly id: string;
  public username: string;
  public googleId?: string;
  public email?: string;
  public picture?: string;

  constructor(params: UserParams) {
    const { id, username, googleId, email, picture } = params;

    this.id = id;
    this.username = username;
    this.googleId = googleId;
    this.email = email;
    this.picture = picture;
  }
}
