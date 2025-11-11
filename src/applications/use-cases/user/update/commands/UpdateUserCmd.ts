import User from '../../../../../domains/user/entities/User';

export interface UpdateUserCmd {
  id: string;
  payload: Pick<User, 'name'>;
}
