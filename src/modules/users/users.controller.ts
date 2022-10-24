import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { Role } from '@/constants/role.enum';
import { Roles } from 'src/decorators/roles.decorator';

import { UsersService } from './users.service';

@ApiTags('USERS')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/admin')
  @Roles(Role.ADMIN)
  adminOnly() {
    console.log('I am a admin');
  }
}
