export interface UserPayload {
  username: string,
  googleId?: string
}

export interface UserParams extends UserPayload {
  id: string
}

export default class User {
  public readonly id: string;
  public username: string;
  public googleId?: string;

  constructor(params: UserParams) {
    const { id, username, googleId } = params;

    this.id = id;
    this.username = username;
    this.googleId = googleId;
  }
}
