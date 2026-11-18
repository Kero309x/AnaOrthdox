import {
  IsBoolean,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from "class-validator";
import { UpdateProfileDto as IUpdateProfileDto } from "@ana-orthodox/shared-types";

export class UpdateProfileDto implements IUpdateProfileDto {
  @IsOptional()
  @IsString({ message: "الاسم يجب أن يكون نصاً (Name must be a string)" })
  @MinLength(2, { message: "يجب ألا يقل الاسم عن حرفين (Name must be at least 2 characters)" })
  @MaxLength(64, { message: "يجب ألا يزيد الاسم عن 64 حرفاً (Name must be at most 64 characters)" })
  fullName?: string;

  @IsOptional()
  @IsIn(["light", "dark", "system"], {
    message: "المظهر يجب أن يكون light أو dark أو system",
  })
  preferredTheme?: string;

  @IsOptional()
  @IsInt({ message: "حجم الخط يجب أن يكون رقماً صحيحاً (Font size must be an integer)" })
  @Min(14, { message: "حجم الخط الأدنى هو 14 (Minimum font size is 14)" })
  @Max(32, { message: "حجم الخط الأقصى هو 32 (Maximum font size is 32)" })
  fontSize?: number;

  @IsOptional()
  @IsBoolean({
    message: "تفعيل التشكيل يجب أن يكون قيمة منطقية (tashkeelEnabled must be a boolean)",
  })
  tashkeelEnabled?: boolean;

  @IsOptional()
  @IsBoolean({
    message: "عرض النص القبطي يجب أن يكون قيمة منطقية (copticScript must be a boolean)",
  })
  copticScript?: boolean;

  @IsOptional()
  @IsString({ message: "معرف الترجمة المفضلة يجب أن يكون نصاً" })
  preferredBibleId?: string | null;
}
