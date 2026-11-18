# PHASE_2_ARCHITECTURE_PROPOSAL.md

## Architectural Blueprint & Domain Modeling for Phase 2 Implementation

**Document Purpose:** Complete architectural specification, database entity models, API contracts, authorization rules, and state machines for Phase 2 domain features in Ana Orthodox (أنا أرثوذكس).  
**Scope:** IAM, User Profiles & Settings, Coptic Bible Domain, Content Provenance & Editorial Workflow, Katameros Lectionary Engine, Synaxarium, and Agpeya.  
**Classification:** Engineering Architecture Proposal & Technical Blueprint  
**Status:** PROPOSED & APPROVED FOR PHASE 2 KICKOFF  
**Last Updated:** 2026-11-17  
**Owner:** Principal Software Architect & Domain Specialists  
**Related Documents:** `docs/research/COPTIC_BIBLE_CANON_RESEARCH.md`, `docs/database/DATABASE_DESIGN.md`, `docs/api/API_CONTRACTS.md`, `docs/security/AUTHORIZATION_MATRIX.md`

---

## 1. Domain Decomposition & Architecture Overview

Phase 2 transitions the platform from the foundational monorepo scaffolding to functional domain modules. Each module maintains strict isolation within the modular monolith architecture:

```
+------------------------------------------------------------------------------------+
|                                    NEXT.JS 16 PWA                                  |
|   +--------------+  +---------------+  +---------------+  +--------------------+   |
|   | Bible Reader |  | Katameros View|  | Agpeya Prayer |  | Synaxarium Viewer  |   |
|   +--------------+  +---------------+  +---------------+  +--------------------+   |
|          |                 |                  |                     |              |
+----------|-----------------|------------------|---------------------|--------------+
           |                 |                  |                     |
           v                 v                  v                     v
+------------------------------------------------------------------------------------+
|                                  NESTJS MODULAR API                                |
|   +--------------+  +---------------+  +---------------+  +--------------------+   |
|   |  AuthModule  |  |  BibleModule  |  | LiturgyModule |  |    AgpeyaModule    |   |
|   +--------------+  +---------------+  +---------------+  +--------------------+   |
|          |                 |                  |                     |              |
|   +--------------+  +---------------+  +---------------+  +--------------------+   |
|   |  UsersModule |  | EditorialMod  |  | SearchModule  |  |    PlacesModule    |   |
|   +--------------+  +---------------+  +---------------+  +--------------------+   |
|                            |                  |                                    |
|                            v                  v                                    |
|   +----------------------------------------------------------------------------+   |
|   |                 Prisma 7 Service (PostgreSQL 18 + Driver Adapter)          |   |
|   +----------------------------------------------------------------------------+   |
+------------------------------------------------------------------------------------+
```

---

## 2. Identity & Access Management (IAM)

### 2.1 Core Security Principles

1. **Public Reading First:** Spiritual, biblical, and liturgical content requires **NO user account**. Registration is strictly optional for personal bookmarks, notes, and reading plans.
2. **Stateless JWT with Rotated Refresh Tokens:**
   - Access Token: Short-lived (15 minutes), HMAC-SHA256, contains user ID, role, and email.
   - Refresh Token: Long-lived (30 days), stored hashed (`sha256`) in database with automatic rotation and family revocation on reuse detection.
3. **Password Security:** Hashed with `bcrypt` (work factor 12) or Argon2id.
4. **Session Invalidation:** Immediate revocation of all user tokens upon password change or administrative suspension.

### 2.2 Proposed Prisma Entity Models

```prisma
enum UserRole {
  ANONYMOUS
  USER
  EDITOR
  ADMINISTRATOR
}

model User {
  id               String            @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  email            String            @unique @db.VarChar(255)
  passwordHash     String            @map("password_hash") @db.VarChar(255)
  fullName         String            @map("full_name") @db.VarChar(150)
  role             UserRole          @default(USER)
  isActive         Boolean           @default(true) @map("is_active")
  emailVerified    Boolean           @default(false) @map("email_verified")
  createdAt        DateTime          @default(now()) @map("created_at") @db.Timestamptz(6)
  updatedAt        DateTime          @updatedAt @map("updated_at") @db.Timestamptz(6)

  profile          UserProfile?
  refreshTokens    RefreshToken[]
  bookmarks        UserBookmark[]
  notes            UserNote[]
  editorialReviews EditorialReview[]

  @@map("users")
}

model RefreshToken {
  id               String            @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  userId           String            @map("user_id") @db.Uuid
  tokenHash        String            @unique @map("token_hash") @db.VarChar(255)
  expiresAt        DateTime          @map("expires_at") @db.Timestamptz(6)
  revokedAt        DateTime?         @map("revoked_at") @db.Timestamptz(6)
  replacedByToken  String?           @map("replaced_by_token") @db.VarChar(255)
  userAgent        String?           @map("user_agent") @db.VarChar(255)
  ipAddress        String?           @map("ip_address") @db.VarChar(45)
  createdAt        DateTime          @default(now()) @map("created_at") @db.Timestamptz(6)

  user             User              @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@map("refresh_tokens")
}

model UserProfile {
  id               String            @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  userId           String            @unique @map("user_id") @db.Uuid
  preferredTheme   String            @default("emerald-gold") @map("preferred_theme") @db.VarChar(50)
  fontSize         Int               @default(18) @map("font_size")
  tashkeelEnabled  Boolean           @default(true) @map("tashkeel_enabled")
  copticScript     Boolean           @default(false) @map("coptic_script")
  preferredBibleId String?           @map("preferred_bible_id") @db.VarChar(50)
  updatedAt        DateTime          @updatedAt @map("updated_at") @db.Timestamptz(6)

  user             User              @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("user_profiles")
}
```

---

## 3. Coptic Orthodox Holy Bible Domain Architecture

### 3.1 Flexible Structural Data Model (Audit-Hardened in Phase 1.3)

To ensure the schema never forces destructive migrations when canonical classifications or liturgical distinctions are refined, categorization uses flexible attributes and clear status strings:

```prisma
enum Testament {
  OLD
  NEW
}

model BibleEdition {
  id             String         @id @db.VarChar(50) // e.g. "vandyck-1865", "bohairic-coptic"
  nameArabic     String         @map("name_arabic") @db.VarChar(150)
  nameEnglish    String         @map("name_english") @db.VarChar(150)
  language       String         @db.VarChar(10) // "ar", "cop", "en"
  direction      String         @default("rtl") @db.VarChar(5) // "rtl" or "ltr"
  isDefault      Boolean        @default(false) @map("is_default")
  license        String         @db.VarChar(100) // e.g. "Public Domain", "Licensed"
  licenseOwner   String?        @map("license_owner") @db.VarChar(150)
  attribution    String?        @db.Text
  checksumSha256 String         @map("checksum_sha256") @db.VarChar(64)
  approvalStatus String         @default("PENDING_REVIEW") @map("approval_status") @db.VarChar(30)
  createdAt      DateTime       @default(now()) @map("created_at") @db.Timestamptz(6)

  verses         BibleVerse[]

  @@map("bible_editions")
}

model BibleBook {
  id                String            @id @db.VarChar(10) // e.g. "GEN", "PSA", "TOB", "MAT"
  orderIndex        Int               @unique @map("order_index") // 1 to 73
  testament         Testament
  category          String            @db.VarChar(50) // "PENTATEUCH", "HISTORICAL", "WISDOM", "MAJOR_PROPHET", "GOSPEL", etc.
  canonicalStatus   String            @default("PROTOCANONICAL") @map("canonical_status") @db.VarChar(30) // "PROTOCANONICAL", "DEUTEROCANONICAL", "LITURGICAL_APPENDIX"
  isDeuterocanonical Boolean          @default(false) @map("is_deuterocanonical")
  nameArabic        String            @map("name_arabic") @db.VarChar(100)
  nameEnglish       String            @map("name_english") @db.VarChar(100)
  nameCoptic        String?           @map("name_coptic") @db.VarChar(100)
  chapterCount      Int               @map("chapter_count")

  chapters          BibleChapter[]
  verses            BibleVerse[]

  @@map("bible_books")
}

model BibleChapter {
  id            String         @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  bookId        String         @map("book_id") @db.VarChar(10)
  chapterNumber Int            @map("chapter_number")
  verseCount    Int            @map("verse_count")

  book          BibleBook      @relation(fields: [bookId], references: [id], onDelete: Cascade)
  verses        BibleVerse[]

  @@unique([bookId, chapterNumber])
  @@map("bible_chapters")
}

model BibleVerse {
  id             String         @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  editionId      String         @map("edition_id") @db.VarChar(50)
  bookId         String         @map("book_id") @db.VarChar(10)
  chapterId      String         @map("chapter_id") @db.Uuid
  chapterNumber  Int            @map("chapter_number")
  verseNumber    Int            @map("verse_number")
  verseText      String         @map("verse_text") @db.Text
  verseTextPlain String         @map("verse_text_plain") @db.Text // Stripped Tashkeel for search
  lxxNumbering   String?        @map("lxx_numbering") @db.VarChar(30) // e.g. "LXX:Ps 50:3"

  edition        BibleEdition   @relation(fields: [editionId], references: [id], onDelete: Cascade)
  book           BibleBook      @relation(fields: [bookId], references: [id], onDelete: Cascade)
  chapter        BibleChapter   @relation(fields: [chapterId], references: [id], onDelete: Cascade)
  bookmarks      UserBookmark[]
  notes          UserNote[]

  @@unique([editionId, bookId, chapterNumber, verseNumber])
  @@index([bookId, chapterNumber])
  @@map("bible_verses")
}
```

---

## 3.2 Phase 2 Governance & Implementation Boundaries

| Subsystem / Feature                 | Implementation Status for Phase 2 Kickoff | Dependency / Prerequisite                                                    | Risk & Governance Rule                                                  |
| ----------------------------------- | ----------------------------------------- | ---------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| **IAM & Auth Module**               | **SAFE TO IMPLEMENT**                     | PostgreSQL container or cloud database                                       | Standard software engineering; no ecclesiastical dependency.            |
| **User Profiles & Bookmarks**       | **SAFE TO IMPLEMENT**                     | IAM Module                                                                   | Standard software engineering.                                          |
| **Bible Schema & DTOs**             | **SAFE TO IMPLEMENT (Structural Only)**   | Prisma 7                                                                     | Schema is structural; zero text committed.                              |
| **Bible Text Ingestion**            | **CONDITIONALLY GATED**                   | Public-domain 1865 Van Dyck text with verified SHA-256                       | Only 1865 raw public domain text permitted.                             |
| **Deuterocanonical Text Ingestion** | **BLOCKED**                               | Formal licensing agreement from Bible Society of Egypt or Bishopric of Youth | Prohibited until written ecclesiastical permission is secured.          |
| **Katameros Lectionary Engine**     | **STRUCTURAL ONLY**                       | Lectionary cycle rules                                                       | Logic safe to code; text pericopes linked by reference, not duplicated. |
| **Synaxarium Data**                 | **GATED**                                 | Public domain text source verification                                       | Requires theological board review.                                      |
| **Agpeya Text**                     | **GATED**                                 | Public domain traditional Coptic text verification                           | Requires theological board review.                                      |

```

---

## 4. Content Provenance & Editorial Review Workflow

### 4.1 Publication State Machine

Every piece of ecclesiastical text (Bible translations, Patristic homilies, Synaxarium biographies) transitions through strict governance states:

```

[ DRAFT ]
|
v (Author / Content Contributor submits)
[ IN_REVIEW ]
|
v (Theological Review Board validates against Coptic Synod canons)
[ APPROVED ]
|
v (Editor publishes to public database)
[ PUBLISHED ]
|
v (Archived upon replacement with authoritative update)
[ ARCHIVED ]

````

### 4.2 Editorial Schema

```prisma
enum PublicationState {
  DRAFT
  IN_REVIEW
  APPROVED
  PUBLISHED
  ARCHIVED
}

model EditorialItem {
  id             String            @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  entityType     String            @map("entity_type") @db.VarChar(50) // "bible_edition", "synaxarium_day", etc.
  entityId       String            @map("entity_id") @db.VarChar(100)
  state          PublicationState  @default(DRAFT)
  versionNumber  Int               @default(1) @map("version_number")
  sourceAttribution String         @map("source_attribution") @db.Text
  notes          String?           @db.Text
  createdById    String            @map("created_by_id") @db.Uuid
  createdAt      DateTime          @default(now()) @map("created_at") @db.Timestamptz(6)
  updatedAt      DateTime          @updatedAt @map("updated_at") @db.Timestamptz(6)

  reviews        EditorialReview[]

  @@map("editorial_items")
}

model EditorialReview {
  id             String            @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  itemId         String            @map("item_id") @db.Uuid
  reviewerId     String            @map("reviewer_id") @db.Uuid
  decision       String            @db.VarChar(20) // "APPROVED", "CHANGES_REQUESTED", "REJECTED"
  comments       String?           @db.Text
  createdAt      DateTime          @default(now()) @map("created_at") @db.Timestamptz(6)

  item           EditorialItem     @relation(fields: [itemId], references: [id], onDelete: Cascade)
  reviewer       User              @relation(fields: [reviewerId], references: [id], onDelete: Cascade)

  @@map("editorial_reviews")
}
````

---

## 5. Katameros (القطمارس) Lectionary Engine

### 5.1 Liturgical Cycles Breakdown

The Katameros is organized across distinct temporal cycles:

1. **Annual Sundays (قطمارس الآحاد):** Readings for the 4-5 Sundays of each of the 12 Coptic months.
2. **Annual Weekdays (قطمارس الأيام):** Readings for ordinary weekdays (Monday through Saturday).
3. **Jonah's Fast (صوم وفصح يونان):** 3 fasting days + Jonah's Passover.
4. **Great Lent (قطمارس الصوم الكبير):** Preparation week, 40 days, Baptism Sunday, Lazarus Saturday, Palm Sunday.
5. **Holy Pascha (قطمارس البصخة المقدسة):** Eve and Day hours of Monday through Bright Saturday.
6. **Holy 50 Days / Pentecost (قطمارس الخماسين):** 7 weeks from Easter Sunday to Pentecost Sunday.

### 5.2 Structure of a Divine Service Reading Set

Each Katameros day provides readings for:

- **Vespers (صلاة العشية):** Prophecy (when prescribed), Psalm, Gospel.
- **Matins (صلاة باكر):** Prophecy, Psalm, Gospel.
- **Divine Liturgy (القداس الإلهي):**
  - Pauline Epistle (البولس)
  - Catholic Epistle (الكاثوليكون)
  - Acts of the Apostles (الإبركسيس)
  - Synaxarium Commemoration (السنكسار)
  - Liturgy Psalm & Gospel (المزمور والإنجيل)

---

## 6. Synaxarium (السنكسار) Architecture

- **Calendar Mapping:** Fixed to the 365 days of the Coptic Calendar (13 Coptic Months: Thoout, Paopi, Hathor, Kiahk, Tobi, Meshir, Paremhat, Parmouti, Pashons, Paoni, Epip, Mesori, and Nasie).
- **Structure:**
  - `coptic_month` (1-13)
  - `coptic_day` (1-30, Nasie 1-5 or 6 in leap years)
  - `commemorations`: List of entries containing saint name, martyrdom / departure narrative, historical era, associated icons, and feast rank.

---

## 7. Agpeya (كتاب صلوات السواعي) Architecture

The Book of Hours is divided into 7 canonical hours + the Monastic Veil Prayer:

1. **Prime / First Hour (باكر — 6:00 AM):** Commemorates the Resurrection and true Light.
2. **Terce / Third Hour (الساعة الثالثة — 9:00 AM):** Descent of the Holy Spirit and Christ's trial.
3. **Sext / Sixth Hour (الساعة السادسة — 12:00 PM):** The Crucifixion.
4. **None / Ninth Hour (الساعة التاسعة — 3:00 PM):** Christ's death on the Cross and the Penitent Thief.
5. **Vespers / Eleventh Hour (الغروب — 5:00 PM):** Taking Christ down from the Cross.
6. **Compline / Twelfth Hour (النوم — 6:00 PM):** The burial of Christ.
7. **Midnight Service (نصف الليل):** The Second Coming; three watches (خدمات).
8. **The Veil Prayer (صلاة الستار):** Specific to monastic tradition.

Each hour comprises:

- Introductory prayers (Our Father, Thanksgiving, Psalm 50)
- Prescribed Psalter selection (e.g. 19 psalms in Prime, 12 in Terce, etc.)
- Holy Gospel pericope
- Liturgical Paschal troparia (القطع)
- Kyrie Eleison (41 times)
- Holy Trisagion
- Absolution of the Hour
- Concluding prayer

---

## 8. Summary of Proposed API Endpoints for Phase 2

| Module      | Method | Endpoint                                      | Description                                         |
| ----------- | ------ | --------------------------------------------- | --------------------------------------------------- |
| **Auth**    | `POST` | `/api/v1/auth/register`                       | Register user account                               |
| **Auth**    | `POST` | `/api/v1/auth/login`                          | Login and receive access/refresh tokens             |
| **Auth**    | `POST` | `/api/v1/auth/refresh`                        | Rotate refresh token                                |
| **Bible**   | `GET`  | `/api/v1/bible/editions`                      | List available translations and languages           |
| **Bible**   | `GET`  | `/api/v1/bible/books`                         | List full 73 canonical books with categories        |
| **Bible**   | `GET`  | `/api/v1/bible/books/:code/chapters/:chapter` | Full chapter text with parallel translation support |
| **Bible**   | `GET`  | `/api/v1/bible/search`                        | Full-text search with diacritic normalization       |
| **Liturgy** | `GET`  | `/api/v1/liturgy/katameros/today`             | Dynamic resolution of today's readings              |
| **Liturgy** | `GET`  | `/api/v1/liturgy/synaxarium/today`            | Today's saints and martyrs                          |
| **Agpeya**  | `GET`  | `/api/v1/agpeya/prayers`                      | List all 7 canonical hours                          |
| **Agpeya**  | `GET`  | `/api/v1/agpeya/prayers/:hourId`              | Full prayer text, psalms, and gospel of the hour    |
