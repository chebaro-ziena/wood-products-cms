import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, Min } from 'class-validator';

export class CreatePriceItemDto {
  @ApiProperty({ example: 1000, description: 'délka (mm)' })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  length: number;

  @ApiProperty({ example: 300, description: 'šířka (mm)' })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  width: number;

  @ApiProperty({ example: 40, description: 'tloušťka (mm)' })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  thickness: number;

  @ApiProperty({ example: 1100, description: 'cena m3' })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  pricePerM3: number;

  @ApiProperty({ example: 462, description: 'cena ks. (entered manually)' })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  pricePerPiece: number;
}

export class UpdatePriceItemDto extends PartialType(CreatePriceItemDto) {}
