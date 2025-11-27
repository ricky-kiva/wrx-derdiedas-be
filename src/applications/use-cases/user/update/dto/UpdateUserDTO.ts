import { UserParams } from '../../../../../domains/user/entities/User';

export type UpdateUserDTO = Omit<UserParams, 'googleId' | 'email'>;
