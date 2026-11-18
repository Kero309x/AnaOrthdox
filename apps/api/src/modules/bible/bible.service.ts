import { Injectable } from "@nestjs/common";
import { BibleBookSummary } from "@ana-orthodox/shared-types";

@Injectable()
export class BibleService {
  /**
   * IMPORTANT ARCHITECTURAL NOTICE:
   * This is an initial development fixture representing 7 sample canonical books
   * (3 Old Testament, 4 Gospels) intended strictly for end-to-end integration and
   * UI contract verification in Phase 1.
   *
   * It is NOT the complete Coptic Orthodox canon (which contains 73 canonical books:
   * 46 Old Testament including the Deuterocanonical books, and 27 New Testament books).
   * Full database-backed catalogue and verses schema will be introduced in Phase 2
   * following approved canonical data curation.
   */
  private readonly sampleBooks: BibleBookSummary[] = [
    {
      id: "gen",
      code: "GEN",
      nameArabic: "التكوين",
      nameEnglish: "Genesis",
      testament: "OLD",
      order: 1,
      chapterCount: 50,
      isStructuralSample: true,
    },
    {
      id: "exo",
      code: "EXO",
      nameArabic: "الخروج",
      nameEnglish: "Exodus",
      testament: "OLD",
      order: 2,
      chapterCount: 40,
      isStructuralSample: true,
    },
    {
      id: "lev",
      code: "LEV",
      nameArabic: "اللاويين",
      nameEnglish: "Leviticus",
      testament: "OLD",
      order: 3,
      chapterCount: 27,
      isStructuralSample: true,
    },
    {
      id: "mat",
      code: "MAT",
      nameArabic: "متى",
      nameEnglish: "Matthew",
      testament: "NEW",
      order: 40,
      chapterCount: 28,
      isStructuralSample: true,
    },
    {
      id: "mrk",
      code: "MRK",
      nameArabic: "مرقس",
      nameEnglish: "Mark",
      testament: "NEW",
      order: 41,
      chapterCount: 16,
      isStructuralSample: true,
    },
    {
      id: "luk",
      code: "LUK",
      nameArabic: "لوقا",
      nameEnglish: "Luke",
      testament: "NEW",
      order: 42,
      chapterCount: 24,
      isStructuralSample: true,
    },
    {
      id: "jhn",
      code: "JHN",
      nameArabic: "يوحنا",
      nameEnglish: "John",
      testament: "NEW",
      order: 43,
      chapterCount: 21,
      isStructuralSample: true,
    },
  ];

  async getBooks(): Promise<BibleBookSummary[]> {
    return this.sampleBooks;
  }

  async getBookByCode(code: string): Promise<BibleBookSummary | null> {
    const book = this.sampleBooks.find((b) => b.code.toUpperCase() === code.toUpperCase());
    return book || null;
  }
}
