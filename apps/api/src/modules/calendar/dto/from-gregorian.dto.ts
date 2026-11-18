import { IsNotEmpty, IsString, Matches } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class FromGregorianDto {
  @ApiProperty({
    description: "Gregorian ISO date string in YYYY-MM-DD format",
    example: "2026-09-11",
  })
  @IsNotEmpty({ message: "حقل التاريخ مطلوب (date is required)" })
  @IsString({ message: "التاريخ يجب أن يكون نصاً (date must be a string)" })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: "صيغة التاريخ يجب أن تكون YYYY-MM-DD (Date must be formatted as YYYY-MM-DD)",
  })
  date!: string;
}
