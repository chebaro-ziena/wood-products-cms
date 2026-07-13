import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';

class OrderedImage {
  id: string;
  order: number;
}

export class ReorderImagesDto {
  @ApiProperty({
    type: [OrderedImage],
    example: [
      { id: 'uuid-1', order: 0 },
      { id: 'uuid-2', order: 1 },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderedImage)
  images: OrderedImage[];
}
