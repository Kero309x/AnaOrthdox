# INTERACTION_CATALOG.md

**Purpose:** Comprehensive inventory and interaction contract for every interactive UI element in the platform.  
**Scope:** Client interactions, buttons, inputs, modals, gestures, state changes, and accessibility triggers  
**Status:** APPROVED (Baseline Architecture)  
**Last Updated:** 2026-11-17  
**Owner:** Frontend Agent  
**Related Documents:** SCREEN_CATALOG.md, COMPONENT_CATALOG.md, RESPONSIVE_RULES.md

---

## 1. Interaction Contract Doctrine

- **No Dead Controls:** Every visible button, switch, or interactive link must execute a defined state mutation, navigation, or action. If an action is not yet available, the control must either be hidden or set to disabled with an explanatory tooltip.
- **Immediate Visual Feedback:** Every interaction must trigger visual feedback within 100ms (ripple, state change, or spinner).
- **RTL-Compliant Motion:** Sliders, drawers, transitions, and progress bars animate along the RTL vector.

---

## 2. Core Interactive Control Registry

| Control ID                 | Screen           | Label / Name (Arabic)      | Type             | Action / Trigger                         | Loading State           | Success Feedback                       | Auth Req                 |
| -------------------------- | ---------------- | -------------------------- | ---------------- | ---------------------------------------- | ----------------------- | -------------------------------------- | ------------------------ |
| `BTN-NAV-DRAWER-TOGGLE`    | Global Shell     | قائمة التنقل الرئيسية      | Icon Button      | Opens main navigation drawer             | Immediate open          | Drawer visible                         | No                       |
| `BTN-THEME-TOGGLE`         | Global Shell     | تبديل المظهر               | Switch/Menu      | Switches Light / Dark / Liturgical Plum  | None                    | Smooth CSS variable swap               | No                       |
| `BTN-BIBLE-BOOK-SELECT`    | Bible Reader     | اختيار السفر               | Dropdown Menu    | Opens book picker modal                  | Skeleton loader         | Book list rendered                     | No                       |
| `BTN-BIBLE-NEXT-CH`        | Bible Reader     | الأصحاح التالي (RTL Left)  | Floating Button  | Navigates to next chapter                | Inline progress bar     | New chapter rendered                   | No                       |
| `BTN-BIBLE-PREV-CH`        | Bible Reader     | الأصحاح السابق (RTL Right) | Floating Button  | Navigates to previous chapter            | Inline progress bar     | Prev chapter rendered                  | No                       |
| `BTN-BIBLE-BOOKMARK`       | Verse Action Bar | إضافة إشارة مرجعية         | Icon Button      | Calls `POST /api/v1/user/bookmarks`      | Icon pulse              | Toast: "تم الحفظ في الإشارات المرجعية" | Yes (redirects to login) |
| `BTN-BIBLE-ADD-NOTE`       | Verse Action Bar | كتابة تأمل أو ملاحظة       | Icon Button      | Opens note modal with editor             | Modal transition        | Note saved                             | Yes                      |
| `BTN-HYMN-PLAY-PAUSE`      | Hymn Player      | تشغيل / إيقاف مؤقت         | Fab Button       | Toggles HTML5 audio stream               | Circular buffer spinner | Audio starts / Icon toggles            | No                       |
| `SLD-HYMN-SCRUBBER`        | Hymn Player      | شريط تقدم اللحن            | Slider (RTL)     | Seeks audio timestamp                    | Instant update          | Position reflects                      | No                       |
| `BTN-KATAMEROS-DATE-PICK`  | Katameros Screen | اختيار تاريخ القراءات      | Date Picker      | Queries liturgy for date                 | Content skeleton        | Liturgical readings rendered           | No                       |
| `BTN-AGPEYA-HOUR-SELECT`   | Agpeya Screen    | اختيار الصلاة              | Segmented Button | Switches hour (باكر, غروب, نوم...)       | Tab crossfade           | Hour prayers loaded                    | No                       |
| `BTN-CHURCH-SEARCH`        | Churches Dir     | بحث عن كنيسة               | Search Bar       | Filters churches by city/name            | Debounced indicator     | Filtered list rendered                 | No                       |
| `BTN-PWA-INSTALL`          | Global Banner    | تثبيت التطبيق              | Action Button    | Triggers browser `beforeinstallprompt`   | Banner animates         | App installed to home screen           | No                       |
| `BTN-AUTH-SUBMIT-LOGIN`    | Auth Login       | تسجيل الدخول               | Filled Button    | Submits credentials to `/auth/login`     | Button spinner          | Redirects to previous page             | No                       |
| `BTN-AUTH-TAB-TOGGLE`      | Account Screen   | تبديل الدخول / إنشاء حساب  | Segmented Button | Switches between Login and Register form | Instant swap            | Active tab styled                      | No                       |
| `BTN-AUTH-SUBMIT-REGISTER` | Auth Register    | إنشاء الحساب والتسجيل      | Filled Button    | Submits data to `/auth/register`         | Button spinner          | Authenticated session established      | No                       |
| `BTN-AUTH-LOGOUT`          | Account Screen   | تسجيل الخروج               | Outlined Button  | Invalidate session via `/auth/logout`    | Button spinner          | Returns to unauthenticated view        | Yes                      |
| `BTN-AUTH-LOGOUT-ALL`      | Account Screen   | خروج من كافة الأجهزة       | Text Button      | Calls `/auth/logout-all` with confirm    | Instant state reset     | All sessions revoked                   | Yes                      |
| `SLD-FONT-SIZE`            | Account Screen   | حجم خط القراءات والنصوص    | Slider           | Mutates preview and saved fontSize       | Instant font resizing   | Real-time scripture sample reflects    | Yes                      |
| `SWT-TASHKEEL-TOGGLE`      | Account Screen   | إظهار التشكيل على النصوص   | Switch           | Toggles Arabic diacritics visibility     | Instant text toggle     | Diacritics shown/hidden in preview     | Yes                      |
| `SWT-COPTIC-TOGGLE`        | Account Screen   | عرض النصوص القبطية الأصلية | Switch           | Toggles Coptic script display            | Instant switch          | Preference updated                     | Yes                      |
| `BTN-PREFS-SAVE`           | Account Screen   | حفظ التفضيلات              | Filled Button    | Calls `PATCH /api/v1/auth/profile`       | "جاري الحفظ..."         | Toast: "تم حفظ التفضيلات بنجاح!"       | Yes                      |
| `BTN-SESSION-REVOKE`       | Account Screen   | إنهاء الجلسة               | Danger Button    | Calls `DELETE /api/v1/auth/sessions/:id` | Item fade               | Session removed from list              | Yes                      |
| `BTN-ADMIN-PUBLISH`        | Admin Editorial  | نشر المحتوى                | Filled Button    | Calls `POST /admin/content/publish`      | Overlay progress        | Toast: "تم نشر المحتوى بنجاح"          | Yes (Editor/Admin)       |

---

## 3. Gestural & Keyboard Interaction Rules

- **Swipe Gestures:** In the Bible reader and Katameros, horizontal swipe left advances to the next chapter (in RTL flow); swipe right returns to the previous chapter.
- **Keyboard Shortcuts:**
  - `ArrowLeft` in RTL reader: Next chapter / verse.
  - `ArrowRight` in RTL reader: Previous chapter / verse.
  - `Space`: Play/pause audio player when active.
  - `Escape`: Close modals, bottom sheets, and navigation drawers.
