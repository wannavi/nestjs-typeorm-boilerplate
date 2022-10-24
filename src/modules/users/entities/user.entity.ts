import { Column, Entity } from 'typeorm';

import { AbstractEntity, IAbstractEntity } from '@/common/abstract.entity';
import { Role } from '@/constants/role.enum';
import { UseDto } from '@/shared/decorators/use-dto.decorator';

import { UserDto } from '../dto/user.dto';

export interface IUser extends IAbstractEntity<UserDto> {
  role: Role;
  username: string;
  email: string;
  password?: string;
}

@Entity()
@UseDto(UserDto)
export class User extends AbstractEntity<UserDto> implements IUser {
  @Column({ type: 'enum', enum: Role, default: Role.USER })
  role: Role;

  @Column()
  username: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  password?: string;
}
