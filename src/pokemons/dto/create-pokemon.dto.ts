import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreatePokemonDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsNumber()
  @IsOptional()
  @Min(1)
  hp?: number;

  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  sprites?: string[];
}
