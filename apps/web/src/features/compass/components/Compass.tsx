"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { BottomNav, Header, useTheme } from "@/shared/ui/chrome";
import { CompassIcon } from "@/shared/ui/icons";
import { toArabicNumber } from "@/domain/calendar/coptic";

type CompassState = "loading" | "unsupported" | "needs-permission" | "active" | "denied";

type OrientationEventWithWebkit = DeviceOrientationEvent & {
  webkitCompassHeading?: number;
};

function screenAngle(): number {
  const so = window.screen.orientation;
  if (so && typeof so.angle === "number") return so.angle;
  const legacy = (window as unknown as { orientation?: number }).orientation;
  return typeof legacy === "number" ? legacy : 0;
}

// Only north-referenced readings count as a compass bearing. iOS Safari
// reports webkitCompassHeading directly; Android Chrome fires
// deviceorientationabsolute with absolute=true, whose alpha we convert and
// compensate for the screen rotation angle. A plain deviceorientation alpha
// is relative to an arbitrary frame, so it is never shown as a bearing.
function absoluteHeading(event: DeviceOrientationEvent): number | null {
  const e = event as OrientationEventWithWebkit;
  if (
    typeof e.webkitCompassHeading === "number" &&
    !Number.isNaN(e.webkitCompassHeading)
  ) {
    return ((e.webkitCompassHeading % 360) + 360) % 360;
  }
  if (event.absolute && typeof event.alpha === "number") {
    return (360 - event.alpha + screenAngle() + 360) % 360;
  }
  return null;
}

// A real compass where the device allows it: iOS asks for motion access
// through requestPermission, Android Chrome delivers the heading directly.
// On devices without a sensor the dial stays as a clearly-labelled design
// preview, matching the concept screen's own note.
export default function Compass() {
  const { dark, toggleTheme } = useTheme();
  const [state, setState] = useState<CompassState>("loading");
  const [heading, setHeading] = useState<number | null>(null);
  const headingRef = useRef<number | null>(null);
  const [smoothed, setSmoothed] = useState(90);

  const onOrientation = useCallback((event: DeviceOrientationEvent) => {
    const value = absoluteHeading(event);
    if (value === null) return;
    headingRef.current = value;
    setHeading(value);
  }, []);

  const startListening = useCallback(() => {
    window.addEventListener("deviceorientationabsolute", onOrientation, true);
    window.addEventListener("deviceorientation", onOrientation, true);
    setState("active");
  }, [onOrientation]);

  useEffect(() => {
    if (!("DeviceOrientationEvent" in window)) { setState("unsupported"); return; }
    const doe = DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> };
    if (typeof doe.requestPermission === "function") setState("needs-permission");
    else startListening();
    return () => {
      window.removeEventListener("deviceorientationabsolute", onOrientation, true);
      window.removeEventListener("deviceorientation", onOrientation, true);
    };
  }, [onOrientation, startListening]);

  async function askPermission() {
    try {
      const doe = DeviceOrientationEvent as unknown as {
        requestPermission?: () => Promise<string>;
      };
      const result = await doe.requestPermission!();
      if (result === "granted") {
        startListening();
      } else {
        setState("denied");
      }
    } catch {
      setState("denied");
    }
  }

  // Smooth the dial rotation so it glides instead of jumping.
  useEffect(() => {
    if (heading === null) return;
    const timer = window.setInterval(() => {
      const target = headingRef.current;
      if (target === null) return;
      setSmoothed((current) => {
        const delta = ((target - current + 540) % 360) - 180;
        return (current + delta * 0.18 + 360) % 360;
      });
    }, 60);
    return () => window.clearInterval(timer);
  }, [heading]);

  const live = state === "active" && heading !== null;
  // Live: the rose rotates against the real heading. Preview: rose sits
  // north-up and the needle rests on شرق, exactly like the concept screen.
  const dialHeading = live ? smoothed : 0;
  const needleRotation = live ? 0 : 90;
  const facingEast = live && Math.abs(((dialHeading - 90 + 540) % 360) - 180) < 12;

  return (
    <div className="bg-cream dark:bg-night min-h-dvh transition-colors">
      <main className="relative mx-auto min-h-dvh max-w-md pb-32">
        <Header
          title="البوصلة"
          dark={dark}
          onToggleTheme={toggleTheme}
          back
          backHref="/sections"
        />

        <p className="text-ink/60 dark:text-night-ink/60 px-8 pt-4 text-right text-[13px] leading-6">
          حدد اتجاه الشرق قبل الصلاة.
        </p>

        <section className="px-6 pt-6">
          <div className="relative mx-auto aspect-square max-w-[300px]">
            <div
              className="absolute inset-0 rounded-full border-2 border-rose-badge bg-white shadow-[0_2px_12px_rgba(73,41,46,0.05)] dark:border-card-border-dark dark:bg-night-card"
              aria-hidden="true"
            />
            {/* The rose rotates against the heading so "شرق" always points to real east. */}
            <div
              className="absolute inset-0 transition-transform duration-100 ease-out"
              style={{ transform: `rotate(${-dialHeading}deg)` }}
            >
              <span className="text-primary dark:text-rose absolute top-3 left-1/2 -translate-x-1/2 text-base font-black">
                شمال
              </span>
              <span className="text-primary dark:text-rose absolute bottom-3 left-1/2 -translate-x-1/2 text-base font-black">
                جنوب
              </span>
              <span className="absolute top-1/2 right-3 -translate-y-1/2">
                <span
                  className={`rounded-full px-3 py-1 text-base font-black transition-colors ${
                    facingEast
                      ? "bg-primary text-white"
                      : "bg-primary/90 text-white"
                  }`}
                >
                  شرق
                </span>
              </span>
              <span className="text-primary dark:text-rose absolute top-1/2 left-3 -translate-y-1/2 text-base font-black">
                غرب
              </span>
              {Array.from({ length: 8 }, (_, i) => (
                <span
                  key={i}
                  className="bg-rose absolute top-1/2 left-1/2 h-4 w-[3px] rounded-full"
                  style={{
                    transform: `translate(-50%,-50%) rotate(${45 * i + 22.5}deg) translateY(-126px)`,
                  }}
                  aria-hidden="true"
                />
              ))}
            </div>
            {/* Fixed needle points the way the phone faces; east is where "شرق" sits on the rose. */}
            <div
              className="absolute inset-0 flex items-center justify-center transition-transform duration-500"
              style={{ transform: `rotate(${needleRotation}deg)` }}
            >
              <svg viewBox="0 0 100 100" className="h-24 w-24" aria-hidden="true">
                <polygon points="50,18 58,55 42,55" fill="var(--color-primary)" />
                <polygon points="50,82 58,55 42,55" fill="var(--color-gold)" />
                <circle cx="50" cy="55" r="7" fill="var(--color-gold-soft)" stroke="var(--color-primary)" strokeWidth="2.5" />
              </svg>
            </div>
          </div>

          {live && (
            <p className="text-ink/60 dark:text-night-ink/60 mt-4 text-center text-[13px] font-bold">
              {facingEast
                ? "أنت واقف في اتجاه الشرق تقريباً"
                : `اتجاهك الحالي ${toArabicNumber(Math.round(dialHeading))}° من الشمال`}
            </p>
          )}

          {state === "needs-permission" && (
            <div className="mt-5 text-center">
              <button
                type="button"
                onClick={askPermission}
                className="bg-primary rounded-full px-8 py-3 text-sm font-extrabold text-white transition-transform active:scale-95"
              >
                تشغيل البوصلة
              </button>
              <p className="text-ink/55 dark:text-night-ink/55 mt-2 text-[11px] leading-5">
                جهازك محتاج إذن الوصول لمستشعر الاتجاه.
              </p>
            </div>
          )}
        </section>

        <section className="px-6 pt-5">
          <div className="flex flex-wrap items-center gap-3 rounded-3xl border border-card-border bg-white p-4 shadow-[0_2px_12px_rgba(73,41,46,0.05)] dark:border-card-border-dark dark:bg-night-card dark:shadow-none">
            {!live && (
              <span className="bg-gold-badge text-gold-ink shrink-0 rounded-full px-3 py-1 text-xs font-bold">
                معاينة تصميمية
              </span>
            )}
            <span className="min-w-[9rem] flex-1 text-right">
              <span className="text-ink dark:text-night-ink block text-[15px] font-extrabold">
                اتجاه الشرق للصلاة
              </span>
              <span className="text-ink/55 dark:text-night-ink/55 mt-0.5 block text-[11px] leading-4">
                البوصلة بتوضّح اتجاه الشرق أثناء الوقوف للصلاة
              </span>
            </span>
            <span className="icon-badge icon-badge--soft-square bg-gold-soft text-gold-ink flex h-10 w-10 shrink-0 items-center justify-center">
              <CompassIcon className="h-5 w-5" />
            </span>
          </div>
        </section>

        <p className="text-ink/50 dark:text-night-ink/50 px-8 pt-4 text-center text-[11px] leading-5">
          {state === "unsupported" &&
            "مستشعر الاتجاه مش متاح على الجهاز ده، فالمعروض مثال توضيحي للتصميم فقط."}
          {state === "denied" &&
            "إذن المستشعر مرفوض، فالمعروض مثال توضيحي. تقدر تفعّله من إعدادات المتصفح."}
          {state === "needs-permission" &&
            "اضغط تشغيل البوصلة علشان المؤشر يقرأ اتجاه جهازك الحقيقي."}
          {live &&
            "المؤشر بيقرا من مستشعر جهازك؛ بعّد عن المعادن والأجهزة المغناطيسية لقراءة أدق."}
          {state === "loading" && "جاري تجهيز البوصلة…"}
          {state === "active" &&
            heading === null &&
            "بنستنى قراءة اتجاه مطلقة من المستشعر… حرّك جهازك شوية. لو ما ظهرش رقم، يبقى المتصفح أو الجهاز مش بيوفّر بوصلة حقيقية، والمعروض فوق معاينة تصميمية مش اتجاه حقيقي."}
        </p>

        <BottomNav />
      </main>
    </div>
  );
}
