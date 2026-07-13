import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class CreateContactDto {
  @ApiProperty({ example: 'Martin' })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiProperty({ example: '+420 800 000 000' })
  @IsString()
  @MinLength(6)
  phone: string;

  @ApiProperty({ example: 'Do you deliver outside the city?' })
  @IsString()
  @MinLength(3)
  question: string;
}
