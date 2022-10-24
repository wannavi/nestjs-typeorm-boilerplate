import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { AbstractDto } from '../../../common/dto/abstract.dto';
import { Role } from '../../../constants';
import { User } from '../entities/user.entity';

export class UserDto extends AbstractDto {
  @ApiProperty()
  username: string;

  @ApiPropertyOptional({ enum: Role })
  role: Role;

  @ApiPropertyOptional()
  email?: string;

  constructor(user: User) {
    super(user);
  }
}
