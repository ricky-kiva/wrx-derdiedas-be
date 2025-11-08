import JwtTokenDTO from '../../../ports/security/dto/JwtTokenDTO';

export interface LoginDTO {
  jwt: JwtTokenDTO,
  user: {
    id: string,
    email: string,
    name: string
  }
}
