import { Injectable } from '@nestjs/common';
import bcrypt from 'bcryptjs';

import { UsersService } from '../users/users.service';
import { RegisterUserDto } from './dto/register-user.dto';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async register(registerUserDto: RegisterUserDto) {
    const hashedPassword = await bcrypt.hash(registerUserDto.password, 10);

    try {
      const createdUser = await this.usersService.createUser({
        ...registerUserDto,
        password: hashedPassword,
      });

      return createdUser;
    } catch (error) {}
  }
}
