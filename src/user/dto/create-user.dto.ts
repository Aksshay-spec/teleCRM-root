import { IsEmail, IsNotEmpty, IsString, IsIn } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  designation: string;

  // 🔒 L1 can create ONLY L2 / L3
  @IsIn(['L2', 'L3'])
  accessLevel: 'L2' | 'L3';

  @IsString()
  @IsNotEmpty()
  departmentId: string;
}
