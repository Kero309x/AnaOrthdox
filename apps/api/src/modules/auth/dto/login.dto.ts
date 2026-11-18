import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { LoginRequestDto } from "@ana-orthodox/shared-types";

export class LoginDto implements LoginRequestDto {
  @IsEmail({}, { message: "البريد الإلكتروني غير صالح (Invalid email address)" })
  @IsNotEmpty({ message: "البريد الإلكتروني مطلوب (Email is required)" })
  email!: string;

  @IsString({ message: "كلمة المرور يجب أن تكون نصاً (Password must be a string)" })
  @IsNotEmpty({ message: "كلمة المرور مطلوبة (Password is required)" })
  password!: string;
}
