"use client";

import { APP_VERSION_AR } from "@/shared/config/app";

import { useStored } from "@/shared/lib/useStored";
import { localStore } from "@/shared/lib/storage";

import { useEffect, useState } from "react";
import {
  BottomNav,
  Card,
  Header,
  Row,
  SectionTitle,
  Switch,
  Toast,
  useColorTheme,
  useFontScale,
  useTheme,
  useToast,
} from "@/shared/ui/chrome";
import {
  BellIcon,
  BookIcon,
  CheckIcon,
  ChevronLeftIcon,
  InfoIcon,
  MoonIcon,
  PaletteIcon,
  PersonIcon,
  TypeIcon,
} from "@/shared/ui/icons";
import { ExpressiveSlider } from "@/shared/ui/ExpressiveSlider";
import { FONT_MAX, FONT_MIN, FONT_STEP, SEEDS } from "@/shared/theme/theming";

const arabicDigits = new Intl.NumberFormat("ar-EG", { useGrouping: false });

export default function Settings() {
  const { dark, toggleTheme } = useTheme();
  const { scale, changeScale } = useFontScale();
  const { seedId, pickSeed } = useColorTheme();
  const { toast, showToast } = useToast();
  const [notifyPrayers, setNotifyPrayers] = useState(false);

  useEffect(() => {
    setNotifyPrayers(localStore.getItem("notifyPrayers") === "on");
  }, []);

  const [permission, setPermission] = useState<string>("unsupported");
  const [reminderTime, setReminderTime] = useStored<string>("reminderTime", "08:00", (v): v is string => typeof v === "string" && /^\d{2}:\d{2}$/.test(v));

  useEffect(() => {
    if (typeof Notification !== "undefined") setPermission(Notification.permission);
  }, []);

  async function togglePrayers(next: boolean) {
    if (!next) {
      localStore.setItem("notifyPrayers", "off");
      setNotifyPrayers(false);
      showToast("التذكير اتقفل");
      return;
    }
    if (typeof Notification === "undefined") {
      showToast("المتصفح ده مش بيدعم التنبيهات");
      return;
    }
    const result = Notification.permission === "default" ? await Notification.requestPermission() : Notification.permission;
    setPermission(result);
    if (result !== "granted") {
      localStore.setItem("notifyPrayers", "off");
      setNotifyPrayers(false);
      showToast("التنبيهات متقفلة في المتصفح. فعّلها من إعدادات الموقع");
      return;
    }
    if (!localStore.setItem("notifyPrayers", "on")) {
      showToast("تعذر حفظ اختيار التنبيهات على الجهاز");
      return;
    }
    setNotifyPrayers(true);
    showToast("اتفعّل التذكير، وبيشتغل والتطبيق مفتوح");
  }

  function testNotification() {
    try {
      new Notification("أنا أرثوذكسي", { body: "ده تنبيه تجريبي.", lang: "ar", dir: "rtl" });
      showToast("اتبعت تنبيه تجريبي");
    } catch {
      showToast("تعذّر إرسال التنبيه من المتصفح ده");
    }
  }

  function pickSeedWithToast(id: string) {
    const saved = pickSeed(id);
    showToast(saved ? "لون الثيم اتغيّر واتحفظ على جهازك" : "لون الثيم اتغيّر للجلسة دي بس. تعذر حفظه على الجهاز");
  }

  return (
    <div className="bg-cream dark:bg-night min-h-dvh transition-colors">
      <main className="relative mx-auto min-h-dvh max-w-md pb-32">
        <Header title="الإعدادات" dark={dark} onToggleTheme={toggleTheme} />

        {/* Appearance */}
        <section className="px-6 pt-6">
          <SectionTitle>المظهر</SectionTitle>
          <Card>
            <Row
              icon={<MoonIcon className="h-5 w-5" />}
              label="الوضع الليلي"
              hint={dark ? "مفعّل" : "متوقف"}
              trailing={
                <Switch
                  on={dark}
                  onChange={() => toggleTheme()}
                  label="الوضع الليلي"
                />
              }
            />
            <div className="px-4 py-3.5">
              <div className="flex items-center gap-3">
                <span className="icon-badge icon-badge--soft-square bg-gold-soft text-gold-ink flex h-10 w-10 shrink-0 items-center justify-center">
                  <PaletteIcon className="h-5 w-5" />
                </span>
                <span className="flex-1 text-right">
                  <span className="text-ink dark:text-night-ink block text-[15px] font-extrabold">
                    لون الثيم
                  </span>
                  <span className="text-ink/55 dark:text-night-ink/55 mt-0.5 block text-[11px] leading-4">
                    درجات ألوان Material 3 من اللون اللي تختاره
                  </span>
                </span>
              </div>
              <div className="mt-4 flex flex-wrap gap-x-4 gap-y-3">
                {SEEDS.map((seed) => {
                  const active = seedId === seed.id;
                  return (
                    <button
                      key={seed.id}
                      type="button"
                      onClick={() => pickSeedWithToast(seed.id)}
                      aria-pressed={active}
                      aria-label={seed.label}
                      className="flex w-14 flex-col items-center gap-1.5"
                    >
                      <span
                        className="flex h-11 w-11 items-center justify-center rounded-full transition-transform active:scale-90"
                        style={{
                          backgroundColor: seed.hex,
                          boxShadow: active
                            ? `0 0 0 2px var(--color-cream), 0 0 0 4.5px ${seed.hex}`
                            : "none",
                        }}
                      >
                        {active && <CheckIcon className="h-5 w-5 text-white" />}
                      </span>
                      <span
                        className={`text-[11px] ${
                          active
                            ? "text-ink dark:text-night-ink font-extrabold"
                            : "text-nav-label dark:text-night-ink/60 font-bold"
                        }`}
                      >
                        {seed.label}
                      </span>
                    </button>
                  );
                })}
              </div>
              <p className="text-ink/50 dark:text-night-ink/50 mt-3 text-[11px] leading-5">
                كل لون بيولّد درجاته الفاتحة والغامقة بنظام ألوان Material 3،
                واختيارك بيتحفظ لو التخزين متاح، وبيشتغل في الوضعين النهاري والليلي.
              </p>
            </div>
            <div className="px-4 py-3.5">
              <div className="flex items-center gap-3">
                <span className="icon-badge icon-badge--soft-square bg-gold-soft text-gold-ink flex h-10 w-10 shrink-0 items-center justify-center">
                  <TypeIcon className="h-5 w-5" />
                </span>
                <span className="text-ink dark:text-night-ink flex-1 text-right text-[15px] font-extrabold">
                  حجم الخط
                </span>
                <span className="bg-rose-badge text-primary rounded-full px-3 py-1 text-xs font-bold">
                  {arabicDigits.format(scale)}٪
                </span>
              </div>
              <ExpressiveSlider min={FONT_MIN} max={FONT_MAX} step={FONT_STEP} value={scale} label="حجم الخط"
                onChange={(next) => { if (!changeScale(next)) showToast("حجم الخط اتغيّر للجلسة دي بس. تعذر حفظه على الجهاز"); }} />
              <div className="text-ink/50 dark:text-night-ink/50 mt-1.5 flex justify-between text-[11px] font-bold">
                <span>أصغر</span>
                <span>أكبر</span>
              </div>
              <p
                data-testid="font-scale-preview"
                className="bg-cream dark:bg-night text-ink dark:text-night-ink mt-3 rounded-2xl px-4 py-3 text-right text-base leading-7"
              >
                اسحب المؤشر وشوف حجم الخط المناسب ليك هنا قبل ما يتطبق على كل
                صفحات التطبيق.
              </p>
            </div>
          </Card>
        </section>

        {/* Notifications */}
        <section className="px-6">
          <SectionTitle>التنبيهات</SectionTitle>
          <Card>
            <Row
              icon={<BellIcon className="h-5 w-5" />}
              label="تذكير يومي"
              hint="تذكير في وقت تختاره، والتطبيق مفتوح"
              trailing={
                <Switch
                  on={notifyPrayers}
                  onChange={togglePrayers}
                  label="تذكير يومي"
                />
              }
            />
            {notifyPrayers && (
              <div className="flex items-center gap-3 px-4 py-3.5">
                <button type="button" onClick={testNotification} className="bg-rose-badge text-primary rounded-full px-4 py-2 text-[12px] font-bold active:scale-95">جرّب تنبيه</button>
                <input type="time" aria-label="وقت التذكير" value={reminderTime} onChange={(e) => e.target.value && setReminderTime(e.target.value)} dir="ltr" className="bg-rose/60 dark:bg-night-chip text-ink dark:text-night-ink rounded-xl px-3 py-2 text-sm font-bold outline-none" />
                <span className="text-ink dark:text-night-ink flex-1 text-right text-[13px] font-bold">وقت التذكير</span>
              </div>
            )}
          </Card>
          <p className="text-ink/50 dark:text-night-ink/50 px-2 pt-2 text-[11px] leading-5">
            {permission === "denied" ? "التنبيهات مقفولة من المتصفح، فعّلها من إعدادات الموقع. " : permission === "unsupported" ? "المتصفح ده مش بيدعم التنبيهات. " : ""}
            التذكير بيشتغل وانت فاتح التطبيق في المتصفح فقط. مفيش إشعارات خلفية والتطبيق مقفول لأن مفيش خادم إشعارات متصل.
          </p>
        </section>

        {/* About */}
        <section className="px-6">
          <SectionTitle>عن التطبيق</SectionTitle>
          <Card>
            <Row
              icon={<PersonIcon className="h-5 w-5" />}
              label="المساهمون"
              hint="فريق التطوير ومراجعة المحتوى"
              href="/contributors"
              trailing={
                <ChevronLeftIcon className="text-nav-label dark:text-night-ink/60 h-4 w-4" />
              }
            />
            <Row
              icon={<BookIcon className="h-5 w-5" />}
              label="المصادر"
              hint="صفحات الكلمات والتسجيلات الأصلية"
              href="/settings/sources"
              trailing={
                <ChevronLeftIcon className="text-nav-label dark:text-night-ink/60 h-4 w-4" />
              }
            />
            <Row
              icon={<InfoIcon className="h-5 w-5" />}
              label="أنا أرثوذكسي"
              hint="بيتك الروحي، كله في مكان واحد"
              trailing={
                <span className="bg-rose-badge text-primary rounded-full px-3 py-1 text-xs font-bold">
                  {APP_VERSION_AR}
                </span>
              }
            />
          </Card>
          <p className="text-ink/50 dark:text-night-ink/50 px-2 pt-2 text-[11px] leading-5">
            نسخة تجريبية: اسمك وتفضيلاتك بتتحفظ على جهازك فقط، من غير مزامنة
            مع أي خادم.
          </p>
        </section>

        <BottomNav active="settings" />
        <Toast message={toast} />
      </main>
    </div>
  );
}
