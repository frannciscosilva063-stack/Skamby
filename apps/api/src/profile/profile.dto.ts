import { IsBoolean, IsOptional, IsString, Length } from "class-validator";

export class UpdateProfileDto {
  @IsString()
  @Length(2, 80)
  displayName!: string;

  @IsOptional()
  @IsString()
  @Length(2, 80)
  city?: string;

  @IsOptional()
  @IsString()
  @Length(2, 2)
  state?: string;

  @IsOptional()
  @IsString()
  @Length(0, 280)
  bio?: string;

  @IsOptional()
  @IsString()
  @Length(10, 20)
  phone?: string;

  @IsOptional()
  @IsString()
  @Length(0, 20)
  cpfMasked?: string;

  @IsOptional()
  @IsBoolean()
  consented?: boolean;
}
