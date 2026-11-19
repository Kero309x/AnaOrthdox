"use client";

import { useState } from "react";
import { isRecord, useStored } from "@/shared/lib/useStored";
import { Panel, useShowToast } from "@/shared/ui/kit";
import { ClockIcon, MapPinIcon, PencilIcon, PlusIcon, TrashIcon } from "@/shared/ui/icons";

interface Details { address: string; phone: string; notes: string; times: { id: string; day: string; time: string }[] }
const empty: Details = { address: "", phone: "", notes: "", times: [] };
const none: Record<string, unknown> = {};
const DAYS = ["الأحد", "الاثنين", "الثلاثاء", "الأربع", "الخميس", "الجمعة", "السبت"];
const field = "bg-rose/60 dark:bg-night-chip text-ink dark:text-night-ink w-full rounded-2xl px-3 py-2.5 text-[13px] outline-none";

export function mapsUrl(name: string, area: string, address: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent([name, address || area].filter(Boolean).join(" "))}`;
}

/** User-entered church details. Saved on this device only; a church directory can replace it later. */
export default function ChurchExtras({ id, name, area }: { id: string; name: string; area: string }) {
  const showToast = useShowToast();
  const [all, setAll] = useStored("church.details", none, isRecord);
  const d: Details = { ...empty, ...((all[id] as Partial<Details>) ?? {}) };
  const [editing, setEditing] = useState(false);
  const [day, setDay] = useState(DAYS[0]);
  const [time, setTime] = useState("07:00");
  const save = (patch: Partial<Details>) => setAll((p) => ({ ...p, [id]: { ...empty, ...((p[id] as Partial<Details>) ?? {}), ...patch } }));
  const phone = d.phone.replace(/[^\d+]/g, "");

  return (
    <>
      <section className="space-y-3 px-6 pt-5">
        <Panel>
          <div className="flex items-center gap-3">
            <button type="button" aria-label={editing ? "تم التعديل" : "تعديل البيانات"} aria-pressed={editing} onClick={() => setEditing((e) => !e)} className="bg-rose-badge text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-full active:scale-95"><PencilIcon className="h-4 w-4" /></button>
            <span className="min-w-0 flex-1 text-right [overflow-wrap:anywhere]">
              <span className="text-ink dark:text-night-ink block text-[15px] font-extrabold">العنوان</span>
              <span className="text-ink/55 dark:text-night-ink/55 mt-0.5 block text-[11px] leading-4">{d.address || area || "لسه مش مضاف، اضغط القلم وضيفه"}</span>
            </span>
            <span className="icon-badge icon-badge--soft-square bg-gold-soft text-gold-ink flex h-10 w-10 shrink-0 items-center justify-center"><MapPinIcon className="h-5 w-5" /></span>
          </div>
          {editing && (
            <div className="mt-3 space-y-2">
              <input aria-label="العنوان" value={d.address} maxLength={120} onChange={(e) => save({ address: e.target.value })} placeholder="العنوان بالتفصيل" className={field} />
              <input aria-label="رقم التليفون" value={d.phone} maxLength={20} inputMode="tel" dir="ltr" onChange={(e) => save({ phone: e.target.value })} placeholder="رقم التليفون" className={`${field} text-right`} />
              <textarea aria-label="ملاحظات" value={d.notes} maxLength={300} onChange={(e) => save({ notes: e.target.value })} placeholder="ملاحظات" className={`${field} h-20 resize-none`} />
            </div>
          )}
        </Panel>

        <Panel>
          <div className="flex items-center gap-3">
            <span className="min-w-0 flex-1 text-right"><span className="text-ink dark:text-night-ink block text-[15px] font-extrabold">مواعيد القداسات</span><span className="text-ink/55 dark:text-night-ink/55 mt-0.5 block text-[11px] leading-4">ضيف المواعيد اللي تعرفها، وبتتحفظ على جهازك</span></span>
            <span className="icon-badge icon-badge--soft-square bg-primary flex h-10 w-10 shrink-0 items-center justify-center text-white"><ClockIcon className="h-5 w-5" /></span>
          </div>
          {d.times.length === 0 && <p className="text-ink/55 dark:text-night-ink/55 mt-3 text-center text-[12px]">لسه مفيش مواعيد مضافة.</p>}
          <ul className="mt-3 space-y-2">
            {d.times.map((t) => (
              <li key={t.id} className="bg-rose/60 dark:bg-night-chip flex items-center gap-2 rounded-2xl px-3 py-2">
                <button type="button" aria-label={`حذف موعد ${t.day}`} onClick={() => save({ times: d.times.filter((x) => x.id !== t.id) })} className="text-primary flex h-8 w-8 items-center justify-center rounded-full"><TrashIcon className="h-4 w-4" /></button>
                <span className="text-ink dark:text-night-ink flex-1 text-right text-[13px] font-bold">{t.day} · <bdi dir="ltr">{t.time}</bdi></span>
              </li>
            ))}
          </ul>
          <div className="mt-3 space-y-2">
            <label className="text-ink/70 dark:text-night-ink/70 block text-right text-[12px] font-bold">اليوم
              <select value={day} onChange={(e) => setDay(e.target.value)} className={`${field} mt-1`}>{DAYS.map((x) => <option key={x}>{x}</option>)}</select>
            </label>
            <label className="text-ink/70 dark:text-night-ink/70 block text-right text-[12px] font-bold">الساعة
              <input type="time" value={time} onChange={(e) => setTime(e.target.value)} dir="ltr" className={`${field} mt-1`} />
            </label>
            <button type="button" aria-label="إضافة موعد" onClick={() => { if (d.times.length >= 14) { showToast("وصلت للحد الأقصى للمواعيد"); return; } if (!time) { showToast("اختار الساعة الأول"); return; } save({ times: [...d.times, { id: `${Date.now()}`, day, time }] }); showToast("اتضاف الموعد"); }} className="bg-primary flex w-full items-center justify-center gap-2 rounded-full py-3 text-sm font-extrabold text-white active:scale-95"><PlusIcon className="h-5 w-5" />إضافة الموعد</button>
          </div>
        </Panel>

        {d.notes && !editing && <Panel><p className="text-ink dark:text-night-ink text-right text-[13px] leading-6 [overflow-wrap:anywhere]">{d.notes}</p></Panel>}
      </section>

      <section className="px-6 pt-5">
        <div className="flex gap-3">
          <a href={mapsUrl(name, area, d.address)} target="_blank" rel="noopener noreferrer" className="bg-gold text-gold-ink flex flex-1 items-center justify-center gap-2 rounded-full py-3 text-sm font-extrabold transition-transform active:scale-95"><MapPinIcon className="h-4 w-4" />الاتجاهات</a>
          {phone ? (
            <a href={`tel:${phone}`} className="bg-primary flex flex-1 items-center justify-center gap-2 rounded-full py-3 text-sm font-extrabold text-white transition-transform active:scale-95">اتصال</a>
          ) : (
            <button type="button" onClick={() => { setEditing(true); showToast("ضيف رقم التليفون الأول"); }} className="bg-rose-badge text-primary flex flex-1 items-center justify-center rounded-full py-3 text-sm font-extrabold active:scale-95">ضيف رقم للاتصال</button>
          )}
        </div>
      </section>
    </>
  );
}
