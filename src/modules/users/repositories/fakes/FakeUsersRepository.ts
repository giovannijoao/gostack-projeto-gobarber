import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import { uuid } from 'uuidv4';
import IFindAllUsersDTO from '@modules/users/dtos/IFindAllUsersDTO';
import User from '../../infra/typeorm/entities/User';

class FakeUsersRepository implements IUsersRepository {
  private users: User[] = [];

  public async findById(id: string): Promise<User | undefined> {
    const found = this.users.find(user => user.id === id);
    return found;
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const found = this.users.find(user => user.email === email);
    return found;
  }

  public async save(user: User): Promise<User> {
    const userIndex = this.users.findIndex(u => u.id === user.id);
    this.users[userIndex] = user;
    return user;
  }

  public async create(userData: ICreateUserDTO): Promise<User> {
    const user = new User();
    Object.assign(
      user,
      {
        id: uuid(),
      },
      userData,
    );
    this.users.push(user);
    return user;
  }

  public async findAllUsers({
    expect_user_id,
  }: IFindAllUsersDTO): Promise<User[]> {
    let { users } = this;
    if (expect_user_id) users = users.filter(p => p.id !== expect_user_id);
    return users;
  }
}

export default FakeUsersRepository;
