# Agpeya (الأجبية) reader — status

Status: LOCAL ONLY, not published. Public launch is blocked on the content-rights item below.

## What is real
- `/prayers/[hour]` (7 hours: baaker, thalitha, sadisa, taseaa, ghoroub, noum, montasaf) renders the full hour from the open
  coptic.io API (`https://api.coptic.io/api/agpeya/{prime|terce|sext|none|vespers|compline|midnight}?lang=ar&include=sections`).
- `/api/agpeya/[hour]` is a Next route handler (not a Nest controller; the deployed app is web-only). It fetches upstream server-side with an
  `X-Client-Name: AnaOrthodoxi` header, an 8s timeout, 12h revalidation, and validates the shape (`src/domain/agpeya/normalize.ts`). A
  malformed or incomplete payload returns 502; the UI then shows an error with retry and never substitute text.
- No prayer text is stored in this repository. Tests use synthetic strings only.

## Block-level gaps found (word-sequence diff of API vs St-Takla.org page per hour, 2026-11-19)
- All six day hours: the Lord's Prayer right after the "introduction to every hour" is on the St-Takla page and absent from the API output.
- Prime: the Pauline reading (Ephesians 4) and the "from the faith of the Church" passage in the opening are absent; the API also places
  "Come let us worship" before the thanksgiving, while the St-Takla page puts it after Psalm 50.
- Midnight: "Arise, O children of light", the great midnight absolution and the priests' absolution, and some Trisagion/petition passages are absent.
- Psalm 50 wording differs from the St-Takla Agpeya page. The Coptic-in-Arabic-letters responses on St-Takla are not in the API.
- The reader shows these as a visible notice (src/domain/agpeya/gaps.ts); nothing is generated to fill them.
- This is an automated comparison against ONE page per hour. It is evidence of omissions, not proof of canonical completeness.

## What is NOT covered
- The API has no Veil prayer (صلاة الستار), which St-Takla.org lists as an eighth item. No other prayers (confession, Tasbeha) either.
- Feast/season variants: the API serves one fixed text per hour.
- The Tasbeha card on `/prayers` still has no text.

## Rights (unresolved)
- coptic.io code is MIT. That does not state a license for the prayer text. The maintainers' PR #108 says the Arabic comes from
  St-Takla.org. St-Takla's FAQ asks that source and link be given and discourages bulk copying; it is not a license.
- Psalm 50 in the API is a different, vocalized wording from the St-Takla Agpeya page. Verify against the printed edition used by the church.
- Do not publish before written permission or a clear license for the Arabic text is obtained.

## Path to a complete, usable Arabic text (options, not decisions)
Keep three layers apart: (1) the ancient prayers and psalms themselves, (2) a given Arabic translation/edition of them, (3) a website's compilation and
formatting. An absent license does not show who holds rights in layer 2 or 3, and does not make them free. No legal conclusion is drawn here.

| Option | Provenance / terms found | Completeness | Effort / risk |
|---|---|---|---|
| A. coptic.io API (current) | Code MIT. Text license not stated; maintainers' PR #108 says Arabic from St-Takla.org. | 7 hours; see gap list above | Ask maintainers for text provenance and a license statement; report upstream gaps. |
| B. St-Takla.org pages | Own FAQ: no blanket reuse license; gave explicit permission only to Wikipedia; says they are not the sole source of many texts. | 7 hours + Veil page | Needs their written permission. |
| C. agpeya.org | Bilingual site with Veil and "Other prayers"; no license text found; contact form exists. | Has Veil/other prayers | Needs written permission. |
| D. 1922 Arabic edition by Deacon Tadros Yassa (368 pp, scan on Coptic Treasures, stated aim: public-domain material) | Published 1922-11-02; scan terms and legal status for the text not verified. | Printed 7-hour book (Veil not checked) | Needs a legal check of the edition's status, OCR of an Arabic print (no Arabic OCR available here) and full human proofreading. Wording is 1922, may differ from today's printed text. |
| E. Penn/OPenn Lewis O 29 (c.1650 Arabic Ajbiyah manuscript) | Public Domain Mark on archive.org (lewis_o_029). | A Coptic prayer book + Marian prayer | Manuscript scan, machine OCR only; archaic wording; transcription project, not a drop-in. |
| F. Official church edition via a church body | Not located yet. | Presumed complete | Permission request to the publisher; most authoritative for accuracy. |

## Bundled dataset (default)
The reader and `/api/agpeya/[hour]` serve `apps/web/src/data/agpeya/agpeya.json`: the seven hours, the Veil prayer (`/prayers/satar`) and midnight as three
watches. No remote fetch and no fallback text. `NEXT_PUBLIC_AGPEYA_SOURCE=coptic-api` switches back to the incomplete coptic.io API, for comparison only.
Rebuild the file with `python3 apps/web/scripts/agpeya-export.py <app/src/main/assets/agpeya from github.com/abanoubha/agpeya>`.

**Sources and edits.**
- Base text: the SQLite file of https://github.com/abanoubha/agpeya (repository LICENSE: MIT, Copyright (c) 2023 Abanoub Hanna). Credit: Abanoub Hanna's open-source Agpeya app. That repository does not document the upstream of its prayer text, so this project does not claim independently verified text rights. Other credits: refrain wording from St-Takla.org (pages listed per entry), the Veil Psalm 118 refrain positions from copticchurch.net, one spelling check from the Van Dyck Arabic Bible.
- Refrains: the DB abbreviates the Coptic-letter refrains ("ذوكصابتري…", "كي نين…", "ذكصاسي…"). `scripts/agpeya-refrain-expansions.json` writes 60 of them out (Psalm 118 in midnight watch 1 and in the Veil, the rest in the pieces blocks) (and replaces the run-together
  "كينين" once in the Vespers pieces) exactly as on the St-Takla.org page named in each entry (https://st-takla.org/Agpeya/). The exporter checks each entry against 4 context words and fails on any mismatch.
- One typo fix: Psalm 141:2 in the Veil, Compline and midnight watch 3, "لتسقم" to "لتستقم" (Van Dyck, https://free.bible/vandyck/psalms/141/ and https://st-takla.org/Bibles/BibleSearch/showVerses.php?book=22&chapter=141&vmax=2&vmin=2).
- Kept as in the DB (St-Takla differs, DB agrees with or is as valid as Van Dyck, or the difference is St-Takla's spacing/spelling): "مسكنا" (Ps 132:13 Van Dyck "مسكنا له", St-Takla "مسكننا"),
  "وجهه" (Ps 67, Sext), "ليخز" (Ps 70, Sext), "فوق" (Ps 113, None), "عني" (Ps 13, Prime), "سلم" (None pieces; St-Takla "أسلم", both are valid Arabic, not settled), the heading "انجيل يوحنا" in the Prime gospel block.
- Punctuation: each written-out refrain is wrapped as "(cue written-out text)" like the St-Takla page, replacing the DB's "…" or ".." marks. The two Veil Psalm 118 cues (after stanzas 20 and 21) use the Arabic wording of the same refrain from the St-Takla Midnight page; the St-Takla Veil page itself leaves them abbreviated, and the position is confirmed by the Veil page of https://www.copticchurch.net/liturgy/agpeya/7.veil.html ("Glory be to You, O Lover of Mankind" after stanzas 20 and 21).
- The DB's own rubric lines are kept (e.g. the "ثم يقال كيريي ليسون يا رب ارحم مرة" note and "من مزامير معلمنا داود النبي بركاته علينا آمين"), so the original instructions are not lost.
- Midnight watch 3 order: the DB's own order for this watch leaves out three prayers that the same DB holds and uses in Prime, Compline and the Veil: "الثلاث تقديسات" (with "يا رب اغفر لنا خطايانا..."), "السلام لكِ" and "بدء قانون الإيمان". The export places them after the concluding gospel ("الآن يا سيدي تطلق عبدك" , Luke 2:29-32, Simeon's song) and before the creed, which is the order of the Arabic text at https://www.stmaryseattle.org/Agbeya/Nesfellel_3.aspx (the wording of those three blocks is the DB's, equal to that page word for word). Nothing is copied from that page and no DB block is removed. Sources differ on watch 2: St-Takla and coptara put a Trisagion at the end of watch 2, while the Seattle, copticchurch.net and liturgies.net pages (and this dataset) do not. Watch 2 is kept as the DB has it; that is an edition difference, not a gap in this app.
- Lord's Prayer cues: the DB and St-Takla end many blocks with the cue "أبانا الذي في السموات..." and print the prayer in full only once, at the start of the hour. For a pray-through, the 24 cues are written out with the DB's own full Lord's Prayer text (key lords_prayer, unchanged), on a new line after the lead-in.
- Heading: the DB heading "الانجيل" of the midnight watch 3 closing passage (Luke 2:29-32) is shown as "إنجيل الختام", the label used at https://www.stmaryseattle.org/Agbeya/Nesfellel_3.aspx.
- One placeholder remains by design: the patriarch's name in the priests' absolution ("أنبا.. ..") is a blank the reader fills in; nothing is invented there.
- "كيرياليسون (يا رب ارحم) 41 مرة": the St-Takla rubric sits before the final "قدوس قدوس قدوس" block on all 7 pages. The export adds that instruction as a tap counter, a reading aid labelled as such, at the same place (each of the three watches for midnight).

**Verification (what it is and is not).** Every one of the 239 block entries was compared with the St-Takla page of its hour by direct word comparison (Arabic normalized: diacritics, hamza/ya/ta marbuta forms, punctuation
removed). After the edits above, the only remaining differences are the kept variants listed, DB-only rubric lines and headings, and St-Takla headings. Apart from the watch 3 order fix above, no missing paragraph was found. The reference is one website, not an
independent canonical text, so this is not a character-level or canonical proofread: compare against the printed Agpeya used by your church. Files: coverage ledger and the position map in the project hand-off.

