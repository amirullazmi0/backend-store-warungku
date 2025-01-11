import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { z } from 'zod';

export class RegisterDTO {
  @IsNotEmpty({ message: 'name is not empty' })
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
export class LoginDTO {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(8)
  password: string;
}

export const authRegisterRequestSchema = z.object({
  name: z.string().min(1, 'name is required'),
  email: z.string().min(1, 'email is required'),
  password: z.string().min(1, 'password is required'),
});

export const authLoginRequestSchema = z.object({
  email: z.string().min(1, 'email is required'),
  password: z.string().min(1, 'password is required'),
});
