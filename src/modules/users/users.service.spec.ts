import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

export const DUMMY_USER = new User({
  username: 'John Doe',
  email: 'super@example.com',
  password: 'should be hashed',
  provider: 'email',
  createdAt: new Date(),
  updatedAt: new Date(),
});

export const DUMMY_USER_1 = new User({
  username: 'wannavi',
  email: 'wannavi@example.com',
  password: 'should be hashed',
  provider: 'email',
  createdAt: new Date(),
  updatedAt: new Date(),
});

export const DUMMY_USERS = [DUMMY_USER, DUMMY_USER_1];

describe('UserService', () => {
  let usersService: UsersService;
  let userRepository: Repository<User>;

  const USER_REPOSITORY_TOKEN = getRepositoryToken(User);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          // 👉 Mocking UserModel
          provide: USER_REPOSITORY_TOKEN,
          useValue: {
            create: jest.fn().mockReturnValue(DUMMY_USER),
            save: jest.fn(),
            find: jest.fn().mockResolvedValue(DUMMY_USERS),
            findOne: jest.fn().mockResolvedValue(DUMMY_USER),
          },
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(USER_REPOSITORY_TOKEN);
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
  });

  it('userRepository should be defined', () => {
    expect(userRepository).toBeDefined();
  });

  describe('findById', () => {
    it('생성되지 않은 유저의 id가 주어진다면 NotFoundException 에러를 던진다.', async () => {
      const userId = 'should be uuid';
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(undefined);

      const result = async () => {
        await usersService.findById(userId);
      };

      await expect(result).rejects.toThrowError(
        new NotFoundException('유저 정보를 찾을 수 없습니다.'),
      );
    });

    it('생성된 유저의 id가 주어진다면 해당 id의 유저를 반환한다.', async () => {
      const userId = 'should be uuid';
      const existingUser = new User({
        id: userId,
        username: 'wannavi',
        email: 'wannavi@gmail.com',
        password: 'should-be-hashed',
      });
      const userRepositoryFindOneSpy = jest
        .spyOn(userRepository, 'findOne')
        .mockResolvedValue(existingUser);

      const result = await usersService.findById(userId);

      expect(userRepositoryFindOneSpy).toHaveBeenCalledWith({
        where: { id: userId },
      });
      expect(result.username).toBe('wannavi');
      expect(result.email).toBe('wannavi@gmail.com');
    });
  });

  describe('findByEmail', () => {
    it('생성된 유저의 email이 주어딘다면 해당 유저를 반환한다.', async () => {
      const userEmail = 'wannvi@gmail.com';
      const existingUser = new User({
        id: 'should be uuid',
        username: 'wannavi',
        email: userEmail,
        password: 'should be hashed',
      });
      const userRepositoryFindOneSpy = jest
        .spyOn(userRepository, 'findOne')
        .mockResolvedValue(existingUser);

      const result = await usersService.findByEmail(userEmail);

      expect(userRepositoryFindOneSpy).toHaveBeenCalledWith({
        where: { email: userEmail },
      });
      expect(result.email).toBe(userEmail);
    });
  });

  describe('create', () => {
    it('유저를 생성하고, 생성한 유저를 반환한다.', async () => {
      const requestDto: CreateUserDto = {
        username: 'John Doe',
        email: 'super@example.com',
        password: 'should be hashed',
        provider: 'email',
      };

      const result = await usersService.create(requestDto);

      expect(userRepository.create).toHaveBeenCalledWith(requestDto);
      expect(result).toBe(DUMMY_USER);
    });
  });
});
