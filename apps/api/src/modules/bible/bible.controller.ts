import { Controller, Get, Param, NotFoundException } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse as SwaggerResponse } from "@nestjs/swagger";
import { BibleService } from "./bible.service";
import { BibleBookSummary } from "@ana-orthodox/shared-types";

@ApiTags("Holy Bible")
@Controller("bible")
export class BibleController {
  constructor(private readonly bibleService: BibleService) {}

  @Get("books")
  @ApiOperation({
    summary: "List structural sample books (Phase 1 Integration Fixture)",
    description:
      "Returns a development sample fixture of 7 books (3 OT, 4 Gospels) for UI and pipeline verification. Note: The full Coptic Orthodox 73-book canon is scheduled for Phase 2 database persistence.",
  })
  @SwaggerResponse({
    status: 200,
    description: "Sample book catalogue returned successfully",
  })
  async getBooks(): Promise<BibleBookSummary[]> {
    return this.bibleService.getBooks();
  }

  @Get("books/:code")
  @ApiOperation({ summary: "Get sample book details by canonical code" })
  @SwaggerResponse({ status: 200, description: "Book found in sample catalogue" })
  @SwaggerResponse({ status: 404, description: "Book code not found in sample catalogue" })
  async getBook(@Param("code") code: string): Promise<BibleBookSummary> {
    const book = await this.bibleService.getBookByCode(code);
    if (!book) {
      throw new NotFoundException(
        `Book with code '${code}' not found in Phase 1 sample catalogue.`
      );
    }
    return book;
  }
}
