import { IsEmail, IsString, Length, MinLength } from "class-validator";

export class RegisterDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  @Length(8, 64)
  password!: string;

  @IsString()
  @Length(2, 80)
  displayName!: string;
}

export class LoginDto {
  @IsEmail()
  email!: string;

  @IsString()
  @Length(8, 64)
  password!: string;
}

export class RefreshDto {
  @IsString()
  refreshToken!: string;
}
