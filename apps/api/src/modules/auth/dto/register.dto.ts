import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";
import { RegisterRequestDto } from "@ana-orthodox/shared-types";

export class RegisterDto implements RegisterRequestDto {
  @IsEmail({}, { message: "البريد الإلكتروني غير صالح (Invalid email address)" })
  @IsNotEmpty({ message: "البريد الإلكتروني مطلوب (Email is required)" })
  email!: string;

  @IsString({ message: "كلمة المرور يجب أن تكون نصاً (Password must be a string)" })
  @MinLength(15, {
    message:
      "يجب ألا تقل كلمة المرور عن 15 حرفاً (Minimum 15 characters required per NIST SP 800-63B)",
  })
  @MaxLength(128, {
    message: "يجب ألا تزيد كلمة المرور عن 128 حرفاً (Password must be at most 128 characters)",
  })
  @IsNotEmpty({ message: "كلمة المرور مطلوبة (Password is required)" })
  password!: string;

  @IsString({ message: "الاسم يجب أن يكون نصاً (Name must be a string)" })
  @MinLength(2, { message: "يجب ألا يقل الاسم عن حرفين (Name must be at least 2 characters)" })
  @MaxLength(64, { message: "يجب ألا يزيد الاسم عن 64 حرفاً (Name must be at most 64 characters)" })
  @IsNotEmpty({ message: "الاسم مطلوب (Name is required)" })
  fullName!: string;
}
