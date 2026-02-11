import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class SignupDto {
  @IsNotEmpty()
  organizationName: string;

  @IsEmail()
  organizationEmail: string;

  @MinLength(6)
  organizationPassword: string;

  @IsEmail()
  adminEmail: string;

  @MinLength(6)
  adminPassword: string;

  @IsNotEmpty()
  adminDesignation: string;
}
