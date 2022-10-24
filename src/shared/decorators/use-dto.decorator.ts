import { AbstractEntity } from 'src/common/abstract.entity';
import { AbstractDto } from 'src/common/dto/abstract.dto';
import { Constructor } from 'src/types';

export function UseDto(
  dtoClass: Constructor<AbstractDto, [AbstractEntity, unknown]>,
): ClassDecorator {
  return (ctor) => {
    ctor.prototype.dtoClass = dtoClass;
  };
}
