import { IsEmail, IsStrongPassword } from "class-validator";

export class AuthForgotPasswordDTO {
  @IsEmail()
  email: string;
}