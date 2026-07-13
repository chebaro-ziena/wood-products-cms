import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class UpdateHomepageDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  heroTitle?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  heroSubtitle?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  heroImageUrl?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  aboutTitle?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  aboutText?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  aboutImageUrl?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  aboutTopImageUrl?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  aboutBottomImageUrl?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  advantagesImageUrl?: string | null;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  advantages?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  contactTitle?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  contactSubtitle?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  contactPhone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  contactAddress?: string;
}
