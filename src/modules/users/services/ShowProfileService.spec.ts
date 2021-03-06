import 'reflect-metadata';
import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import ShowProfileService from './ShowProfileService';

let fakeUsersRepository: FakeUsersRepository;
let showProfile: ShowProfileService;

describe('ShowProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    showProfile = new ShowProfileService(fakeUsersRepository);
  });
  it('should be able to show user profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    const updatedUser = await showProfile.execute(user.id);

    expect(updatedUser.name).toBe('John Doe');
    expect(updatedUser.email).toBe('johndoe@example.com');
  });
  it('should not be able to show the profile from non-existing user', async () => {
    await expect(showProfile.execute('123')).rejects.toBeInstanceOf(AppError);
  });
});
