"use client";

import { APP_VERSION_AR } from "@/shared/config/app";

import { localStore } from "@/shared/lib/storage";

import { useEffect, useState } from "react";
import {
  BottomNav,
  Card,
  Header,
  Row,
  SectionTitle,
  Toast,
  useTheme,
  useToast,
} from "@/shared/ui/chrome";
import {
  ChevronLeftIcon,
  GearIcon,
  InfoIcon,
  MoonIcon,
  PencilIcon,
  PersonIcon,
  SunIcon,
  TrashIcon,
} from "@/shared/ui/icons";
import { clearColorTheme, clearFontScale } from "@/shared/theme/theming";

const DEFAULT_NAME = "ضيف";

export default function Account() {
  const { dark, toggleTheme } = useTheme();
  const { toast, showToast } = useToast();
  const [name, setName] = useState(DEFAULT_NAME);
  const [draft, setDraft] = useState("");
  const [editing, setEditing] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);

  // Local-only profile: the name never leaves this device.
  useEffect(() => {
    const saved = localStore.getItem("profileName");
    if (saved) setName(saved);
  }, []);

  function startEdit() {
    setDraft(name === DEFAULT_NAME ? "" : name);
    setEditing(true);
  }

  function saveEdit() {
    const next = draft.trim().slice(0, 30) || DEFAULT_NAME;
    if (!localStore.setItem("profileName", next)) {
      showToast("تعذر حفظ الاسم على الجهاز. جرّب تفعيل التخزين أو تفريغ مساحة");
      return;
    }
    setName(next);
    setEditing(false);
    showToast("اتحفظ الاسم على جهازك");
  }

  function clearLocalData() {
    const cleared = ["profileName", "notifyPrayers", "favChurches", "quizBest", "memoryBest", "readingFontScale"]
      .map((key) => localStore.removeItem(key));
    cleared.push(clearFontScale(), clearColorTheme());
    if (!cleared.every(Boolean)) {
      showToast("تعذر مسح بعض البيانات. تحقق من إعدادات تخزين المتصفح");
      return;
    }
    setName(DEFAULT_NAME);
    setConfirmClear(false);
    showToast("اتمسحت البيانات المحلية من الجهاز ده");
  }

  return (
    <div className="bg-cream dark:bg-night min-h-dvh transition-colors">
      <main className="relative mx-auto min-h-dvh max-w-md pb-32">
        <Header title="حسابي" dark={dark} onToggleTheme={toggleTheme} />

        {/* Local profile card */}
        <section className="px-6 pt-6">
          <div className="rounded-3xl border border-card-border bg-white p-5 shadow-[0_2px_12px_rgba(73,41,46,0.05)] dark:border-card-border-dark dark:bg-night-card dark:shadow-none">
            <div className="flex items-center gap-4">
              <span className="icon-badge icon-badge--pebble bg-rose-badge text-primary flex h-16 w-16 shrink-0 items-center justify-center">
                {name === DEFAULT_NAME ? (
                  <PersonIcon className="h-7 w-7" />
                ) : (
                  <span className="text-2xl font-black">{name.charAt(0)}</span>
                )}
              </span>
              <div className="flex-1 text-right">
                {editing ? (
                  <input
                    autoFocus
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") saveEdit();
                      if (event.key === "Escape") setEditing(false);
                    }}
                    maxLength={30}
                    placeholder="اكتب اسمك"
                    aria-label="اسمك"
                    className="border-rose text-ink dark:bg-night-chip dark:text-night-ink w-full rounded-xl border-[1.5px] bg-white px-3 py-3 text-base font-extrabold outline-none focus-visible:border-primary dark:border-card-border-dark"
                  />
                ) : (
                  <p className="text-ink dark:text-night-ink text-xl font-black">
                    {name}
                  </p>
                )}
                <p className="text-ink/55 dark:text-night-ink/55 mt-1 text-[11px] leading-4">
                  حساب محلي على جهازك فقط، من غير تسجيل دخول
                </p>
              </div>
              {!editing && (
                <button
                  type="button"
                  onClick={startEdit}
                  aria-label="تعديل الاسم"
                  className="bg-blush dark:bg-night-chip text-primary-deep dark:text-night-ink flex h-12 w-12 shrink-0 items-center justify-center rounded-full transition-transform active:scale-95"
                >
                  <PencilIcon className="h-5 w-5" />
                </button>
              )}
            </div>
            {editing && (
              <div className="mt-4 flex gap-2.5">
                <button
                  type="button"
                  onClick={saveEdit}
                  className="bg-primary flex-1 rounded-full py-2.5 text-sm font-bold text-white transition-transform active:scale-95"
                >
                  حفظ
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="bg-rose text-primary-deep dark:bg-night-chip dark:text-night-ink rounded-full px-6 py-2.5 text-sm font-bold transition-transform active:scale-95"
                >
                  إلغاء
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Account */}
        <section className="px-6">
          <SectionTitle>الحساب</SectionTitle>
          <Card>
            <Row
              icon={<PersonIcon className="h-5 w-5" />}
              label="تسجيل الدخول"
              hint="مزامنة بياناتك بين أجهزتك"
              onClick={() =>
                showToast("تسجيل الدخول محتاج خادم، وهيتوفر في نسخة جاية")
              }
              trailing={
                <span className="bg-gold-badge text-gold-ink rounded-full px-3 py-1 text-xs font-bold">
                  قريباً
                </span>
              }
            />
            <Row
              icon={<TrashIcon className="h-5 w-5" />}
              label="مسح البيانات المحلية"
              hint="الاسم وحجم الخط ولون الثيم والتنبيهات والكنائس المفضلة ونتائج الألعاب"
              danger
              onClick={() => setConfirmClear((open) => !open)}
              trailing={
                <ChevronLeftIcon
                  className={`text-nav-label h-4 w-4 transition-transform ${
                    confirmClear ? "-rotate-90" : ""
                  }`}
                />
              }
            />
            {confirmClear && (
              <div className="px-4 py-3.5">
                <p className="text-ink/70 dark:text-night-ink/70 text-right text-[13px] leading-6">
                  هيتمسح الاسم وحجم الخط ولون الثيم والتنبيهات والكنائس المفضلة
                  ونتائج الألعاب المحفوظة على الجهاز ده بس. الوضع الليلي هيفضل زي ما هو.
                </p>
                <div className="mt-3 flex gap-2.5">
                  <button
                    type="button"
                    onClick={clearLocalData}
                    className="bg-primary flex-1 rounded-full py-2.5 text-sm font-bold text-white transition-transform active:scale-95"
                  >
                    تأكيد المسح
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmClear(false)}
                    className="bg-rose text-primary-deep dark:bg-night-chip dark:text-night-ink rounded-full px-6 py-2.5 text-sm font-bold transition-transform active:scale-95"
                  >
                    تراجع
                  </button>
                </div>
              </div>
            )}
          </Card>
        </section>

        {/* App shortcuts */}
        <section className="px-6">
          <SectionTitle>التطبيق</SectionTitle>
          <Card>
            <Row
              icon={
                dark ? (
                  <SunIcon className="h-5 w-5" />
                ) : (
                  <MoonIcon className="h-5 w-5" />
                )
              }
              label="المظهر"
              hint="التبديل بين النهاري والليلي"
              onClick={toggleTheme}
              trailing={
                <span className="text-nav-label dark:text-night-ink/60 text-xs font-bold">
                  {dark ? "ليلي" : "نهاري"}
                </span>
              }
            />
            <Row
              icon={<GearIcon className="h-5 w-5" />}
              label="الإعدادات"
              hint="لون الثيم وحجم الخط والتنبيهات"
              href="/settings"
              trailing={<ChevronLeftIcon className="text-nav-label h-4 w-4" />}
            />
            <Row
              icon={<InfoIcon className="h-5 w-5" />}
              label="عن التطبيق"
              onClick={() => setAboutOpen((open) => !open)}
              trailing={
                <ChevronLeftIcon
                  className={`text-nav-label h-4 w-4 transition-transform ${
                    aboutOpen ? "-rotate-90" : ""
                  }`}
                />
              }
            />
            {aboutOpen && (
              <div className="px-4 py-3.5 text-right">
                <p className="text-ink dark:text-night-ink text-[15px] font-extrabold">
                  أنا أرثوذكسي
                </p>
                <p className="text-ink/55 dark:text-night-ink/55 mt-1 text-[12px] leading-6">
                  بيتك الروحي، كله في مكان واحد. نسخة تجريبية: اسمك
                  وتفضيلاتك بتتحفظ لو التخزين متاح على جهازك، من غير مزامنة مع أي خادم.
                </p>
                <p className="text-nav-label dark:text-night-ink/60 mt-2 text-xs font-bold">
                  الإصدار {APP_VERSION_AR}
                </p>
              </div>
            )}
          </Card>
        </section>

        <p className="text-ink/45 dark:text-night-ink/45 px-8 pt-6 text-center text-[11px] leading-5">
          حفظ اسمك وتفضيلاتك محتاج تخزين متاح على جهازك. مفيش مزامنة مع أي خادم.
        </p>

        <BottomNav active="account" />
        <Toast message={toast} />
      </main>
    </div>
  );
}
