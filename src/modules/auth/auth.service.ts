import { PostgresErrorCode } from '@/database/error-codes.enum';
import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compareSync, hashSync } from 'bcryptjs';

import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { RegisterUserDto } from './dto/register-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerUserDto: RegisterUserDto): Promise<User> {
    const password = hashSync(registerUserDto.password);

    try {
      const createdUser = await this.usersService.create({
        ...registerUserDto,
        password,
        provider: 'email',
      });

      return createdUser;
    } catch (error: any) {
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new UnauthorizedException('이미 존재하는 이메일 혹은 이름입니다.');
      }

      throw new InternalServerErrorException(error);
    }
  }

  async verifyPassword(password: string, hashedPassword: string): Promise<void> {
    const isPasswordMatching = compareSync(password, hashedPassword);

    if (!isPasswordMatching) {
      throw new UnauthorizedException('이메일/패스워드가 불일치합니다.');
    }
  }
}
