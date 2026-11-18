import { Controller, Get, Query } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CalendarConversionResponseDto } from "@ana-orthodox/shared-types";
import { CalendarService } from "./calendar.service";
import { FromGregorianDto } from "./dto/from-gregorian.dto";
import { ToGregorianDto } from "./dto/to-gregorian.dto";

@ApiTags("Coptic Calendar")
@Controller("calendar/coptic")
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @Get("from-gregorian")
  @ApiOperation({
    summary: "Convert Gregorian date to Coptic Civil Calendar date",
    description:
      "Performs deterministic conversion from a Gregorian calendar date (YYYY-MM-DD) to its exact Coptic date, month metadata, and day of year.",
  })
  @ApiResponse({
    status: 200,
    description: "Successfully converted Gregorian date to Coptic date",
  })
  @ApiResponse({
    status: 400,
    description: "Invalid date format or out-of-range Gregorian date",
  })
  fromGregorian(@Query() query: FromGregorianDto): CalendarConversionResponseDto {
    return this.calendarService.fromGregorian(query.date);
  }

  @Get("to-gregorian")
  @ApiOperation({
    summary: "Convert Coptic Civil Calendar date to Gregorian date",
    description:
      "Performs deterministic conversion from Coptic year (AM), month (1–13), and day to its exact Gregorian calendar date.",
  })
  @ApiResponse({
    status: 200,
    description: "Successfully converted Coptic date to Gregorian date",
  })
  @ApiResponse({
    status: 400,
    description: "Invalid or impossible Coptic date (e.g. 6 Nasie in common year)",
  })
  toGregorian(@Query() query: ToGregorianDto): CalendarConversionResponseDto {
    return this.calendarService.toGregorian(query.year, query.month, query.day);
  }
}
