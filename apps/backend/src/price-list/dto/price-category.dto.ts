import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsString, ValidateNested } from 'class-validator';
import { CreatePriceItemDto } from './price-item.dto';

export class CreatePriceCategoryDto {
  @ApiProperty({ example: 'buk pr' })
  @IsString()
  name: string;

  @ApiProperty({ type: [CreatePriceItemDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreatePriceItemDto)
  items: CreatePriceItemDto[];
}

export class UpdatePriceCategoryDto extends CreatePriceCategoryDto {}
