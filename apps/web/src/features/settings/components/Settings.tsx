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
  Switch,
  Toast,
  useColorTheme,
  useFontScale,
  useTheme,
  useToast,
} from "@/shared/ui/chrome";
import {
  BellIcon,
  CheckIcon,
  InfoIcon,
  MoonIcon,
  PaletteIcon,
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

  function togglePrayers(next: boolean) {
    if (!localStore.setItem("notifyPrayers", next ? "on" : "off")) {
      showToast("تعذر حفظ اختيار التنبيهات على الجهاز");
      return;
    }
    setNotifyPrayers(next);
    showToast(
      next
        ? "اتحفظ اختيارك على جهازك. التنبيهات لسه مش متوفرة في النسخة دي"
        : "التنبيهات اتقفلت",
    );
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
              label="تنبيهات الصلوات"
              hint="تذكير بمواعيد الصلوات اليومية"
              trailing={
                <Switch
                  on={notifyPrayers}
                  onChange={togglePrayers}
                  label="تنبيهات الصلوات"
                />
              }
            />
          </Card>
          <p className="text-ink/50 dark:text-night-ink/50 px-2 pt-2 text-[11px] leading-5">
            التنبيهات لسه مش متوفرة في النسخة دي؛ حفظ اختيارك محتاج تخزين متاح على جهازك.
          </p>
        </section>

        {/* About */}
        <section className="px-6">
          <SectionTitle>عن التطبيق</SectionTitle>
          <Card>
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
