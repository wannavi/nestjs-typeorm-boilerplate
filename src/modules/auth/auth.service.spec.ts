import { PostgresErrorCode } from '@/database/error-codes.enum';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import bcrypt from 'bcryptjs';

import { UsersService } from '../users/users.service';
import { DUMMY_USER } from '../users/users.service.spec';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';

export const DUMMY_TOKEN = 'DUMMY_TOKEN';
export const DUMMY_HASHED_PASSWORD = 'HASHED_PASSWORD';

const signMock = jest.fn(() => DUMMY_TOKEN);
const createUserMock = jest.fn(() => DUMMY_USER);
const hashSyncMock = jest.fn(() => DUMMY_HASHED_PASSWORD);

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useClass: jest.fn(() => ({
            create: createUserMock,
          })),
        },
        {
          provide: JwtService,
          useClass: jest.fn(() => ({
            sign: signMock,
          })),
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('register', () => {
    it('중복된 이메일이 주어진다면 UnauthorizedException 에러를 던진다.', async () => {
      jest.spyOn(usersService, 'create').mockImplementation(() => {
        const UniqueViolationError = class extends Error {
          code = PostgresErrorCode.UniqueViolation;
        };
        throw new UniqueViolationError();
      });

      const result = async () => {
        await authService.register({
          username: 'John Doe',
          email: 'super@example.com',
          password: 'should be hashed',
        });
      };

      await expect(result).rejects.toThrowError(
        new UnauthorizedException('이미 존재하는 이메일 혹은 이름입니다.'),
      );
    });

    it('정상적인 데이터 주어진다면 생성된 유저를 반환한다.', async () => {
      const requestDto: RegisterUserDto = {
        username: 'John Doe',
        email: 'super@example.com',
        password: 'should be hashed',
      };

      jest.spyOn(bcrypt, 'hashSync').mockImplementation(hashSyncMock);

      const result = await authService.register(requestDto);

      expect(result).toBe(DUMMY_USER);
    });
  });
});
