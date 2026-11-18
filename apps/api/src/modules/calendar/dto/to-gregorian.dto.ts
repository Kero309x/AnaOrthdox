import { IsInt, Max, Min } from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

export class ToGregorianDto {
  @ApiProperty({
    description: "Coptic year (Anno Martyrum)",
    example: 1743,
    minimum: 1,
    maximum: 9999,
  })
  @Type(() => Number)
  @IsInt({ message: "السنة القبطية يجب أن تكون رقماً صحيحاً (Year must be an integer)" })
  @Min(1, { message: "السنة القبطية لا يمكن أن تقل عن 1 (Minimum year is 1)" })
  @Max(9999, { message: "السنة القبطية لا يمكن أن تزيد عن 9999 (Maximum year is 9999)" })
  year!: number;

  @ApiProperty({
    description: "Coptic month number (1–13)",
    example: 1,
    minimum: 1,
    maximum: 13,
  })
  @Type(() => Number)
  @IsInt({ message: "رقم الشهر القبطي يجب أن يكون رقماً صحيحاً (Month must be an integer)" })
  @Min(1, { message: "رقم الشهر القبطي يجب أن يكون بين 1 و 13 (Month must be >= 1)" })
  @Max(13, { message: "رقم الشهر القبطي يجب أن يكون بين 1 و 13 (Month must be <= 13)" })
  month!: number;

  @ApiProperty({
    description: "Coptic day of the month (1–30 for months 1–12; 1–5 or 1–6 for month 13)",
    example: 1,
    minimum: 1,
    maximum: 30,
  })
  @Type(() => Number)
  @IsInt({ message: "رقم اليوم يجب أن يكون رقماً صحيحاً (Day must be an integer)" })
  @Min(1, { message: "رقم اليوم لا يمكن أن يقل عن 1 (Minimum day is 1)" })
  @Max(30, { message: "رقم اليوم لا يمكن أن يزيد عن 30 (Maximum day is 30)" })
  day!: number;
}
