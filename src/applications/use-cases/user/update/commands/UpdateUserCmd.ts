import User from '../../../../../domains/user/entities/User';

export interface UpdateUserCmd {
  id: string;
  payload: Partial<Pick<User, 'name'>>;
}
