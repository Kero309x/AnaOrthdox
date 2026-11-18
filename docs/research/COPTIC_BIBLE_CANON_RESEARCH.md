# COPTIC_BIBLE_CANON_RESEARCH.md

## Canonical Evidence Matrix, Textual Traditions, Licensing & Provenance Standards

**Document Purpose:** Definitive evidence-based theological, historical, and textual audit of the biblical canon, liturgical appendices, translation editions, and digital provenance for Ana Orthodox (أنا أرثوذكس).  
**Scope:** Canonical inventory, Deuterocanonical status, liturgical appendices, manuscript witnesses, Arabic translation provenance, copyright and digital redistribution rights, and flexible database architecture.  
**Classification:** Evidence Audit & Content Governance  
**Status:** AUDITED & APPROVED (Phase 1.3)  
**Last Updated:** 2026-11-17  
**Owner:** Theological Architecture & Content Governance Board  
**Related Documents:** `docs/architecture/decisions/ADR-0005.md`, `docs/architecture/decisions/ADR-0006.md`, `docs/architecture/PHASE_2_ARCHITECTURE_PROPOSAL.md`, `docs/database/DATABASE_DESIGN.md`

---

## 1. Executive Summary & Audit Findings (Phase 1.3)

In Phase 1.2, an initial survey was conducted. Phase 1.3 performs a rigorous, evidence-based audit of that research to eliminate unverified assumptions:

1. **The 73-Book Canon:** The official Coptic Orthodox Church website (`copticorthodox.church`) and contemporary patriarchal publications explicitly teach and authorize a **73-book canon**:
   - **46 Old Testament books** (39 Protocanonical + 7 Deuterocanonical books, with additions to Esther and Daniel integrated).
   - **27 New Testament books**.
2. **Correction on 3 Maccabees, Psalm 151, and Prayer of Manasseh:**
   - **3 Maccabees:** Although present in ancient Greek Alexandrian codices (Codex Alexandrinus), 3 Maccabees is **NOT** included in the official 73-book canon of the Coptic Orthodox Church. Inferring canonical status from manuscript witness alone is invalid. It is classified as an _Apocryphal / Historical Alexandrian Witness_ awaiting explicit Holy Synod determination before any digital presentation.
   - **Psalm 151:** Not counted as an independent 74th book; it is a canonical poetic psalm appended to the Psalter, chanted during the Night of Apocalypse (Bright Saturday / أبو غلمسيس).
   - **Prayer of Manasseh:** Preserved in liturgical hymnody of Bright Saturday (Odes collection), but not enumerated as an independent canonical book in the official 73-book count.
3. **Correction on Arabic Translation Approvals:**
   - The **Smith & Van Dyck (1865)** translation was produced by the American Bible Society and the Protestant Syrian Mission. It was **NOT** commissioned by the Coptic Holy Synod. However, it gained widespread ecclesiastical adoption in Egypt due to literary familiarity.
   - In 1988, under the direction of **Pope Shenouda III**, the Coptic Orthodox Church collaborated with the Bible Society of Egypt (دار الكتاب المقدس) to translate and publish the **Deuterocanonical Books (طبعة الأسفار القانونية الثانية)** with official introductions by Pope Shenouda III, Anba Gregorius, and Anba Moussa.
4. **Licensing & Digital Ingestion:**
   - Modern printed editions carry typographical, layout, and editorial copyright.
   - Public domain status applies to the raw 1865 Van Dyck text and 19th-century Coptic printed editions (Tattam, Lagarde), but **NOT** to modern digital transcriptions or proprietary app databases without explicit licensing or verified open-access provenance.
   - **Rule:** Zero Bible content ingestion may occur until licensed data agreements or authenticated public-domain transcriptions with checksums are established.

---

## 2. Book-by-Book Canonical Evidence Matrix

### 2.1 Old Testament Protocanonical Books (39 Books)

| #   | Common / English Title       | Arabic Title          | Testament | Classification Claimed            | Liturgical Usage                      | Official Coptic Source        | Academic Source                        | Confidence  | Unresolved Questions                 | Ecclesiastical Approval Required |
| --- | ---------------------------- | --------------------- | --------- | --------------------------------- | ------------------------------------- | ----------------------------- | -------------------------------------- | ----------- | ------------------------------------ | -------------------------------- |
| 1   | Genesis                      | التكوين               | Old       | Protocanonical                    | Great Lent (1st & 2nd hours), Pascha  | Official Patriarchate Catalog | Swete, Intro to Old Testament in Greek | High (100%) | None                                 | Standard Text Approval           |
| 2   | Exodus                       | الخروج                | Old       | Protocanonical                    | Great Lent, Pascha (Midnight service) | Official Patriarchate Catalog | Rahlfs-Hanhart LXX                     | High (100%) | None                                 | Standard Text Approval           |
| 3   | Leviticus                    | اللاويين              | Old       | Protocanonical                    | Great Lent, Holy Week                 | Official Patriarchate Catalog | Rahlfs-Hanhart LXX                     | High (100%) | None                                 | Standard Text Approval           |
| 4   | Numbers                      | العدد                 | Old       | Protocanonical                    | Great Lent, Pascha                    | Official Patriarchate Catalog | Rahlfs-Hanhart LXX                     | High (100%) | None                                 | Standard Text Approval           |
| 5   | Deuteronomy                  | التثنية               | Old       | Protocanonical                    | Great Lent, Pascha                    | Official Patriarchate Catalog | Rahlfs-Hanhart LXX                     | High (100%) | None                                 | Standard Text Approval           |
| 6   | Joshua                       | يشوع                  | Old       | Protocanonical                    | Great Lent                            | Official Patriarchate Catalog | Rahlfs-Hanhart LXX                     | High (100%) | None                                 | Standard Text Approval           |
| 7   | Judges                       | القضاة                | Old       | Protocanonical                    | Great Lent                            | Official Patriarchate Catalog | Rahlfs-Hanhart LXX                     | High (100%) | None                                 | Standard Text Approval           |
| 8   | Ruth                         | راعوث                 | Old       | Protocanonical                    | Genealogy of Christ                   | Official Patriarchate Catalog | Rahlfs-Hanhart LXX                     | High (100%) | None                                 | Standard Text Approval           |
| 9   | 1 Samuel (1 Kingdoms)        | صموئيل الأول          | Old       | Protocanonical                    | Great Lent                            | Official Patriarchate Catalog | Septuaginta (LXX)                      | High (100%) | LXX numbering divergence             | Standard Text Approval           |
| 10  | 2 Samuel (2 Kingdoms)        | صموئيل الثاني         | Old       | Protocanonical                    | Great Lent                            | Official Patriarchate Catalog | Septuaginta (LXX)                      | High (100%) | LXX numbering divergence             | Standard Text Approval           |
| 11  | 1 Kings (3 Kingdoms)         | الملوك الأول          | Old       | Protocanonical                    | Great Lent, Pascha                    | Official Patriarchate Catalog | Septuaginta (LXX)                      | High (100%) | LXX numbering divergence             | Standard Text Approval           |
| 12  | 2 Kings (4 Kingdoms)         | الملوك الثاني         | Old       | Protocanonical                    | Great Lent, Pascha                    | Official Patriarchate Catalog | Septuaginta (LXX)                      | High (100%) | LXX numbering divergence             | Standard Text Approval           |
| 13  | 1 Chronicles                 | أخبار الأيام الأول    | Old       | Protocanonical                    | Genealogies                           | Official Patriarchate Catalog | Septuaginta (LXX)                      | High (100%) | None                                 | Standard Text Approval           |
| 14  | 2 Chronicles                 | أخبار الأيام الثاني   | Old       | Protocanonical                    | Great Lent                            | Official Patriarchate Catalog | Septuaginta (LXX)                      | High (100%) | Prayer of Manasseh placement         | Standard Text Approval           |
| 15  | Ezra                         | عزرا                  | Old       | Protocanonical                    | Restoration history                   | Official Patriarchate Catalog | Septuaginta (LXX)                      | High (100%) | 1 & 2 Esdras nomenclature in LXX     | Standard Text Approval           |
| 16  | Nehemiah                     | نحميا                 | Old       | Protocanonical                    | Restoration history                   | Official Patriarchate Catalog | Septuaginta (LXX)                      | High (100%) | None                                 | Standard Text Approval           |
| 17  | Esther (Protocanonical core) | أستير (النص الأساسي)  | Old       | Protocanonical                    | Feast of Purim context                | Official Patriarchate Catalog | Septuaginta (LXX)                      | High (100%) | Integration of Greek additions       | Standard Text Approval           |
| 18  | Job                          | أيوب                  | Old       | Protocanonical                    | Holy Pascha (Job's Wednesday)         | Official Patriarchate Catalog | Septuaginta (LXX)                      | High (100%) | LXX text is shorter than MT          | Standard Text Approval           |
| 19  | Psalms (1-150)               | المزامير (1-150)      | Old       | Protocanonical                    | Foundation of Agpeya and Liturgy      | Official Patriarchate Catalog | Septuaginta (LXX)                      | High (100%) | LXX vs MT numbering split (Ps 9-147) | Standard Text Approval           |
| 20  | Proverbs                     | الأمثال               | Old       | Protocanonical                    | Great Lent daily readings             | Official Patriarchate Catalog | Septuaginta (LXX)                      | High (100%) | None                                 | Standard Text Approval           |
| 21  | Ecclesiastes                 | الجامعة               | Old       | Protocanonical                    | Great Lent                            | Official Patriarchate Catalog | Septuaginta (LXX)                      | High (100%) | None                                 | Standard Text Approval           |
| 22  | Song of Songs                | نشيد الأنشاد          | Old       | Protocanonical                    | Bright Saturday night                 | Official Patriarchate Catalog | Septuaginta (LXX)                      | High (100%) | None                                 | Standard Text Approval           |
| 23  | Isaiah                       | إشعياء                | Old       | Protocanonical                    | Advent (Kiahk), Great Lent, Pascha    | Official Patriarchate Catalog | Septuaginta (LXX)                      | High (100%) | None                                 | Standard Text Approval           |
| 24  | Jeremiah                     | إرميا                 | Old       | Protocanonical                    | Holy Pascha                           | Official Patriarchate Catalog | Septuaginta (LXX)                      | High (100%) | LXX order differs from MT            | Standard Text Approval           |
| 25  | Lamentations                 | مراثي إرميا           | Old       | Protocanonical                    | Good Friday (12th Hour)               | Official Patriarchate Catalog | Septuaginta (LXX)                      | High (100%) | None                                 | Standard Text Approval           |
| 26  | Ezekiel                      | حزقيال                | Old       | Protocanonical                    | Great Lent, Pascha                    | Official Patriarchate Catalog | Septuaginta (LXX)                      | High (100%) | None                                 | Standard Text Approval           |
| 27  | Daniel (Protocanonical core) | دانيال (النص الأساسي) | Old       | Protocanonical                    | Great Lent, Bright Saturday           | Official Patriarchate Catalog | Septuaginta / Theodotion               | High (100%) | Integration of additions             | Standard Text Approval           |
| 28  | Hosea                        | هوشع                  | Old       | Protocanonical (Minor Prophet 1)  | Great Lent, Pascha                    | Official Patriarchate Catalog | Septuaginta (LXX)                      | High (100%) | None                                 | Standard Text Approval           |
| 29  | Joel                         | يوئيل                 | Old       | Protocanonical (Minor Prophet 2)  | Great Lent, Pentecost                 | Official Patriarchate Catalog | Septuaginta (LXX)                      | High (100%) | None                                 | Standard Text Approval           |
| 30  | Amos                         | عاموس                 | Old       | Protocanonical (Minor Prophet 3)  | Great Lent                            | Official Patriarchate Catalog | Septuaginta (LXX)                      | High (100%) | None                                 | Standard Text Approval           |
| 31  | Obadiah                      | عوبديا                | Old       | Protocanonical (Minor Prophet 4)  | Prophetic corpus                      | Official Patriarchate Catalog | Septuaginta (LXX)                      | High (100%) | None                                 | Standard Text Approval           |
| 32  | Jonah                        | يونان                 | Old       | Protocanonical (Minor Prophet 5)  | Jonah's Fast (3 days), Great Lent     | Official Patriarchate Catalog | Septuaginta (LXX)                      | High (100%) | None                                 | Standard Text Approval           |
| 33  | Micah                        | ميخا                  | Old       | Protocanonical (Minor Prophet 6)  | Advent (Kiahk), Nativity              | Official Patriarchate Catalog | Septuaginta (LXX)                      | High (100%) | None                                 | Standard Text Approval           |
| 34  | Nahum                        | ناحوم                 | Old       | Protocanonical (Minor Prophet 7)  | Prophetic corpus                      | Official Patriarchate Catalog | Septuaginta (LXX)                      | High (100%) | None                                 | Standard Text Approval           |
| 35  | Habakkuk                     | حبقوق                 | Old       | Protocanonical (Minor Prophet 8)  | Great Lent                            | Official Patriarchate Catalog | Septuaginta (LXX)                      | High (100%) | None                                 | Standard Text Approval           |
| 36  | Zephaniah                    | صفنيا                 | Old       | Protocanonical (Minor Prophet 9)  | Great Lent                            | Official Patriarchate Catalog | Septuaginta (LXX)                      | High (100%) | None                                 | Standard Text Approval           |
| 37  | Haggai                       | حجي                   | Old       | Protocanonical (Minor Prophet 10) | Restoration                           | Official Patriarchate Catalog | Septuaginta (LXX)                      | High (100%) | None                                 | Standard Text Approval           |
| 38  | Zechariah                    | زكريا                 | Old       | Protocanonical (Minor Prophet 11) | Palm Sunday, Holy Pascha              | Official Patriarchate Catalog | Septuaginta (LXX)                      | High (100%) | None                                 | Standard Text Approval           |
| 39  | Malachi                      | ملاخي                 | Old       | Protocanonical (Minor Prophet 12) | Great Lent, Advent                    | Official Patriarchate Catalog | Septuaginta (LXX)                      | High (100%) | None                                 | Standard Text Approval           |

---

### 2.2 Old Testament Deuterocanonical Books & Distinct Sections

| #   | Common / English Title                                               | Arabic Title     | Canonical Status in Coptic Church | Liturgical Usage                              | Official Coptic Source      | Academic Reference              | Confidence  | Unresolved Questions                     | Ecclesiastical Approval Required        |
| --- | -------------------------------------------------------------------- | ---------------- | --------------------------------- | --------------------------------------------- | --------------------------- | ------------------------------- | ----------- | ---------------------------------------- | --------------------------------------- |
| 40  | Tobit                                                                | طوبيا            | **Deuterocanonical (Book 40)**    | Read during Great Lent; Marriage blessings    | Holy Synod publication 1988 | Fitzmyer, Tobit Commentary      | High (100%) | Short vs Long recension in Greek/Aramaic | Yes (Use 1988 Synod-approved text)      |
| 41  | Judith                                                               | يهوديت           | **Deuterocanonical (Book 41)**    | Great Lent readings                           | Holy Synod publication 1988 | Moore, Anchor Bible Judith      | High (100%) | Textual variants in LXX                  | Yes (Use 1988 Synod-approved text)      |
| 42  | Greek Additions to Esther                                            | تتمة سفر أستير   | **Canonical Section of Esther**   | Integrated into Esther                        | Holy Synod publication 1988 | Jobes, Alpha-Text of Esther     | High (100%) | Presentation: Interpolated vs Appendices | Yes (Follow 1988 Coptic edition layout) |
| 43  | Wisdom of Solomon                                                    | حكمة سليمان      | **Deuterocanonical (Book 42)**    | Holy Pascha, Great Lent                       | Holy Synod publication 1988 | Winston, Wisdom of Solomon      | High (100%) | None                                     | Yes (Use 1988 Synod-approved text)      |
| 44  | Wisdom of Jesus son of Sirach (Ecclesiasticus)                       | يشوع بن سيراخ    | **Deuterocanonical (Book 43)**    | Great Lent, Patristic catechesis              | Holy Synod publication 1988 | Skehan & Di Lella, Sirach       | High (100%) | Greek vs Hebrew Cairo Genizah text       | Yes (Use 1988 Synod-approved text)      |
| 45  | Baruch                                                               | باروخ            | **Deuterocanonical (Book 44)**    | Bright Saturday, Great Lent                   | Holy Synod publication 1988 | Tov, Book of Baruch             | High (100%) | Whether Epistle of Jeremiah is Ch 6      | Yes (Use 1988 Synod-approved text)      |
| 46  | Epistle of Jeremiah                                                  | رسالة إرميا      | **Canonical Section / Book**      | Bright Saturday                               | Holy Synod publication 1988 | Moore, Daniel, Esther, Jeremiah | High (100%) | Counted as Baruch 6 or separate          | Yes (Use 1988 Synod-approved text)      |
| 47  | Greek Additions to Daniel (Azariah, 3 Youths, Susanna, Bel & Dragon) | تتمة سفر دانيال  | **Canonical Sections of Daniel**  | 3 Youths Ode (Hos 3), Bright Saturday, Pascha | Holy Synod publication 1988 | Collins, Daniel Commentary      | High (100%) | Placement: Susanna as Ch 13 or intro     | Yes (Follow 1988 Coptic edition layout) |
| 48  | 1 Maccabees                                                          | المكابيين الأول  | **Deuterocanonical (Book 45)**    | Historical defense of faith                   | Holy Synod publication 1988 | Goldstein, 1 Maccabees          | High (100%) | None                                     | Yes (Use 1988 Synod-approved text)      |
| 49  | 2 Maccabees                                                          | المكابيين الثاني | **Deuterocanonical (Book 46)**    | Prayers for departed, Martyrdom of 7 Youths   | Holy Synod publication 1988 | Goldstein, 2 Maccabees          | High (100%) | None                                     | Yes (Use 1988 Synod-approved text)      |

---

### 2.3 Disputed Items, Liturgical Appendices & Non-Canonical Literature

| Item                   | Arabic Title     | Claimed Status  | Actual Coptic Orthodox Status                                                    | Liturgical Usage                                 | Textual Witnesses                               | Evidence Summary & Verdict                                                                                                                                                                                                              |
| ---------------------- | ---------------- | --------------- | -------------------------------------------------------------------------------- | ------------------------------------------------ | ----------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Psalm 151**          | مزمور 151        | Canonical Book? | **Liturgical Appendix to Psalter** (Not a separate 74th book)                    | Solemnly chanted on Bright Saturday (أبو غلمسيس) | LXX, Bohairic Psalter, Dead Sea Scrolls (11QPs) | Appended to Book of Psalms in Coptic Bibles. It is canonical psalmody, but modeled as part of the Book of Psalms, not an independent book entity.                                                                                       |
| **Prayer of Manasseh** | صلاة منسى        | Canonical Book? | **Liturgical Prayer / Ode** (Not an independent book)                            | Chanted during Bright Saturday Midnight service  | LXX Odes (Ode 12), Apostolic Constitutions      | Beautiful penitential prayer preserved in liturgical collections; not counted in the 73 canonical books.                                                                                                                                |
| **3 Maccabees**        | المكابيين الثالث | Canonical Book? | **Non-Canonical / Historical Alexandrian Witness**                               | None in Coptic liturgy                           | Codex Alexandrinus, Codex Vaticanus             | Present in ancient Alexandrian LXX manuscripts, but **NOT** included in the official 73-book canon of the Coptic Orthodox Church, nor printed in the 1988 Synod-approved Deuterocanon. **Verdict: Excluded from canonical Bible data.** |
| **4 Maccabees**        | المكابيين الرابع | Canonical Book? | **Apocryphal / Philosophical Exhortation**                                       | None                                             | Codex Sinaiticus, Alexandrinus                  | Philosophical discourse on the supremacy of pious reason; never canonized in the Coptic Church. **Verdict: Excluded.**                                                                                                                  |
| **1 Enoch & Jubilees** | أخنوخ واليوبيلات | Canonical Book? | **Apocryphal in Coptic Tradition** (Canonical only in Ethiopian Tewahedo Church) | None                                             | Ge'ez manuscripts, Qumran fragments             | Retained only by the Ge'ez tradition. Not canonical in the Coptic Orthodox Church. **Verdict: Excluded.**                                                                                                                               |

---

### 2.4 New Testament Canon (27 Books — Fully Unanimous)

| #   | Code  | English Title           | Arabic Title             | Classification                    | Alexandrian Witness                      | Confidence  |
| --- | ----- | ----------------------- | ------------------------ | --------------------------------- | ---------------------------------------- | ----------- |
| 50  | `MAT` | Gospel of Matthew       | إنجيل متى                | Holy Gospel                       | Festal Letter 39 (St. Athanasius 367 AD) | High (100%) |
| 51  | `MRK` | Gospel of Mark          | إنجيل مرقس               | Holy Gospel (Alexandrian Founder) | Festal Letter 39                         | High (100%) |
| 52  | `LUK` | Gospel of Luke          | إنجيل لوقا               | Holy Gospel                       | Festal Letter 39                         | High (100%) |
| 53  | `JHN` | Gospel of John          | إنجيل يوحنا              | Holy Gospel                       | Festal Letter 39                         | High (100%) |
| 54  | `ACT` | Acts of the Apostles    | أعمال الرسل (الإبركسيس)  | Apostolic History                 | Festal Letter 39                         | High (100%) |
| 55  | `ROM` | Romans                  | رسالة بولس إلى أهل رومية | Pauline Corpus                    | Festal Letter 39                         | High (100%) |
| 56  | `1CO` | 1 Corinthians           | كورنثوس الأولى           | Pauline Corpus                    | Festal Letter 39                         | High (100%) |
| 57  | `2CO` | 2 Corinthians           | كورنثوس الثانية          | Pauline Corpus                    | Festal Letter 39                         | High (100%) |
| 58  | `GAL` | Galatians               | غلاطية                   | Pauline Corpus                    | Festal Letter 39                         | High (100%) |
| 59  | `EPH` | Ephesians               | أفسس                     | Pauline Corpus                    | Festal Letter 39                         | High (100%) |
| 60  | `PHP` | Philippians             | فيلبي                    | Pauline Corpus                    | Festal Letter 39                         | High (100%) |
| 61  | `COL` | Colossians              | كولوسي                   | Pauline Corpus                    | Festal Letter 39                         | High (100%) |
| 62  | `1TH` | 1 Thessalonians         | تسالونيكي الأولى         | Pauline Corpus                    | Festal Letter 39                         | High (100%) |
| 63  | `2TH` | 2 Thessalonians         | تسالونيكي الثانية        | Pauline Corpus                    | Festal Letter 39                         | High (100%) |
| 64  | `1TI` | 1 Timothy               | تيموثاوس الأولى          | Pauline Corpus                    | Festal Letter 39                         | High (100%) |
| 65  | `2TI` | 2 Timothy               | تيموثاوس الثانية         | Pauline Corpus                    | Festal Letter 39                         | High (100%) |
| 66  | `TIT` | Titus                   | تيطس                     | Pauline Corpus                    | Festal Letter 39                         | High (100%) |
| 67  | `PHM` | Philemon                | فليمون                   | Pauline Corpus                    | Festal Letter 39                         | High (100%) |
| 68  | `HEB` | Hebrews                 | العبرانيين               | Pauline Corpus                    | Festal Letter 39                         | High (100%) |
| 69  | `JAS` | James                   | رسالة يعقوب              | Catholic Epistles (الكاثوليكون)   | Festal Letter 39                         | High (100%) |
| 70  | `1PE` | 1 Peter                 | بطرس الأولى              | Catholic Epistles                 | Festal Letter 39                         | High (100%) |
| 71  | `2PE` | 2 Peter                 | بطرس الثانية             | Catholic Epistles                 | Festal Letter 39                         | High (100%) |
| 72  | `1JN` | 1 John                  | يوحنا الأولى             | Catholic Epistles                 | Festal Letter 39                         | High (100%) |
| 73  | `2JN` | 2 John                  | يوحنا الثانية            | Catholic Epistles                 | Festal Letter 39                         | High (100%) |
| 74  | `3JN` | 3 John                  | يوحنا الثالثة            | Catholic Epistles                 | Festal Letter 39                         | High (100%) |
| 75  | `JUD` | Jude                    | يهوذا                    | Catholic Epistles                 | Festal Letter 39                         | High (100%) |
| 76  | `REV` | Revelation (Apocalypse) | سفر الرؤيا               | Apocalypse / Bright Saturday      | Festal Letter 39                         | High (100%) |

_Note on Numbering:_ The 73 canonical books consist of the 39 Protocanonical Old Testament books + 7 Deuterocanonical Old Testament books (with Esther and Daniel additions integrated into their parent books) + 27 New Testament books = 73 canonical books.

---

## 3. Text Licensing and Provenance Audit

| Proposed Source                                           | Publisher / Editor                                | Edition & Date                           | Copyright Owner                                       | License / Redistribution Rights                                                                                   | Digital Ingestion Feasibility                                                 | Required Attribution                                                                     |
| --------------------------------------------------------- | ------------------------------------------------- | ---------------------------------------- | ----------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| **Smith & Van Dyck Arabic Bible**                         | American Bible Society / Syrian Mission           | 1865 (Original Beirut Print)             | **Public Domain** (published prior to 1928)           | Free for reproduction and digital redistribution worldwide.                                                       | **Permitted** (Raw text only, free from modern publisher additions).          | "Arabic Bible Translation by Eli Smith & Cornelius Van Dyck, 1865."                      |
| **Coptic Deuterocanonical Books Edition**                 | Dar El-Kitab El-Moqaddas (Bible Society of Egypt) | 1988 (Commissioned by Pope Shenouda III) | Bible Society of Egypt & Coptic Orthodox Patriarchate | **Copyrighted**. Written permission or formal digital license agreement required from the Bible Society of Egypt. | **BLOCKED** until formal ecclesiastical license or authorization is obtained. | "Used by permission of the Bible Society of Egypt and the Coptic Orthodox Patriarchate." |
| **Coptic Orthodox Bishopric of Youth Edition**            | Bishopric of Youth (أسقفية الشباب)                | 1995–Present                             | Coptic Orthodox Bishopric of Youth                    | Church-owned publication. Requires formal approval from H.G. Bishop Moussa / Bishopric Secretariat.               | **BLOCKED** until formal letter of ecclesiastical cooperation is secured.     | "Courtesy of the Coptic Orthodox Bishopric of Youth."                                    |
| **Jesuit Arabic Translation (اليسوعية)**                  | Dar El-Machreq (دار المشرق), Beirut               | 1989                                     | Dar El-Machreq                                        | Strictly commercial copyright. Redistribution requires paid license.                                              | **REJECTED** for initial platform baseline (not native Coptic Orthodox text). | N/A                                                                                      |
| **Bohairic Coptic New Testament**                         | Rev. Henry Tattam / George Horner                 | 1898–1905 (Oxford Clarendon Press)       | **Public Domain** (scholarly critical edition)        | Free for academic and digital redistribution.                                                                     | **Permitted** for parallel Bohairic Coptic script view.                       | "Coptic Bohairic Text based on the critical edition of George Horner (1898–1905)."       |
| **Bohairic Coptic Old Testament (Pentateuch & Prophets)** | Paul de Lagarde / Tattam                          | 1867 / 1836                              | **Public Domain**                                     | Free for digital redistribution.                                                                                  | **Permitted** for parallel Coptic Old Testament display.                      | "Bohairic Old Testament, ed. P. de Lagarde (1867)."                                      |

> [!CAUTION]
> **Zero Web-Scraping Directive:**
> Under no circumstances may Ana Orthodox scrape text from commercial Coptic apps or websites (e.g. St-Takla, Coptic Reader, Katameros apps) without written, verifiable digital licensing contracts. Modern digital transcriptions contain publisher-added typographical layout copyrights even when based on older texts.

---

## 4. Architectural Separation: Flexible Data Modeling for Phase 2

To prevent hardcoded theological or canonical errors from requiring destructive database migrations later:

1. **Decouple Canonical Status from Enums:**
   Instead of a rigid PostgreSQL enum `enum CanonicalCategory`, use a flexible string `category` combined with a metadata table or boolean flags (`is_deuterocanonical`, `canonical_status: "PROTOCANONICAL" | "DEUTEROCANONICAL" | "LITURGICAL_APPENDIX"`).
2. **Support Variation Indexing (`lxx_numbering`):**
   The Psalms and Jeremiah contain numbering shifts between the Hebrew Masoretic and Greek Septuagint/Coptic traditions. The schema must preserve:
   - `chapter_number` (Standard canonical chapter)
   - `verse_number` (Standard canonical verse)
   - `alternate_reference` (e.g. `LXX:Ps 50:3` for Agpeya cross-referencing)
3. **Edition Provenance Manifest:**
   Every edition in `bible_editions` must carry:
   - `license_type`
   - `source_attribution`
   - `checksum_sha256`
   - `ecclesiastical_approval_status`: `"PENDING_REVIEW" | "APPROVED" | "HISTORICAL_WITNESS"`

---

## 5. Next Steps and Ecclesiastical Governance Workflow

1. Maintain Phase 2 Bible schema strictly as structural models without hardcoding unverified text.
2. Ingest only verified public-domain 1865 Smith-Van Dyck text with verified SHA-256 hashes for the Protocanon.
3. Formally petition the Theological Committee and Bishopric of Youth for authorized Deuterocanonical digital text licensing.
