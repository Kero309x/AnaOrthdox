"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
import { videoClips } from "@/data/catalog";
import { ExpressiveSlider } from "@/shared/ui/ExpressiveSlider";
import { isRecord, isStringArray, useStored } from "@/shared/lib/useStored";
import { DemoBadge, DemoNote, EmptyState, FavButton, Panel, RoundButton, Screen, Skeleton, formatTime, shareOrCopy, useShowToast } from "@/shared/ui/kit";
import { PauseIcon, PlayIcon, RestartIcon, VideoIcon } from "@/shared/ui/icons";

const none: string[] = [];
const noProgress: Record<string, unknown> = {};
// One short neutral file generated for this app (gradient only). It proves the player journey; it is not church content.
const DEMO_SRC = "/demo/demo-video.mp4";

export default function VideoWatch() {
  const id = useSearchParams().get("id");
  const clip = videoClips.find((c) => c.id === id);
  return (
    <Screen title="مشاهدة" backHref="/videos">
      {clip ? (
        <Watch key={clip.id} id={clip.id} />
      ) : (
        <section className="px-6 pt-6"><EmptyState icon={<VideoIcon className="h-6 w-6" />} title="الفيديو ده مش موجود" hint="ممكن يكون اتشال أو الرابط ناقص." action={{ label: "كل الفيديوهات", href: "/videos" }} /></section>
      )}
    </Screen>
  );
}

function Watch({ id }: { id: string }) {
  const clip = videoClips.find((c) => c.id === id)!;
  const showToast = useShowToast();
  const ref = useRef<HTMLVideoElement | null>(null);
  const [favs, setFavs] = useStored("fav.video", none, isStringArray);
  const [later, setLater] = useStored("later.video", none, isStringArray);
  const [progress, setProgress] = useStored("progress.video", noProgress, isRecord);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [failed, setFailed] = useState(false);

  const save = () => {
    const v = ref.current;
    if (v && v.duration > 0) setProgress((p) => ({ ...p, [id]: v.ended ? 0 : v.currentTime / v.duration }));
  };
  const toggle = async () => {
    const v = ref.current;
    if (!v) return;
    try { if (v.paused) await v.play(); else v.pause(); } catch { setFailed(true); }
  };
  const share = async () => {
    const r = await shareOrCopy(clip.title, window.location.href);
    showToast(r === "copied" ? "اتنسخ الرابط" : r === "shared" ? "تمت المشاركة" : "تعذّرت المشاركة");
  };

  return (
    <section className="px-6 pt-6">
      <div className="relative overflow-hidden rounded-[28px] bg-black">
        <video
          ref={ref}
          src={DEMO_SRC}
          playsInline
          preload="metadata"
          aria-label={clip.title}
          className="block aspect-video w-full object-cover"
          onLoadedMetadata={(e) => {
            const v = e.currentTarget;
            setDuration(v.duration);
            const saved = typeof progress[id] === "number" ? (progress[id] as number) : 0;
            if (saved > 0 && saved < 1) v.currentTime = saved * v.duration;
          }}
          onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
          onPlay={() => setPlaying(true)}
          onPause={() => { setPlaying(false); save(); }}
          onEnded={() => { setPlaying(false); save(); }}
          onError={() => setFailed(true)}
        />
        {duration === 0 && !failed && <Skeleton className="absolute inset-0 rounded-none" />}
        <span className="bg-primary-deep/80 absolute right-3 bottom-3 rounded-full px-3 py-1 text-[11px] font-bold text-white">فيديو تجريبي قصير</span>
      </div>
      {failed && <p role="alert" className="text-primary mt-2 text-center text-[12px] font-bold">تعذّر تشغيل الفيديو على المتصفح ده.</p>}

      <div className="pt-5 text-center">
        <p className="text-ink dark:text-night-ink text-xl font-black">{clip.title}</p>
        <p className="text-ink/55 dark:text-night-ink/55 mt-1 flex items-center justify-center gap-2 text-[12px]">{clip.channel} <DemoBadge /></p>
      </div>

      <div className="pt-4">
        <ExpressiveSlider
          label="موضع المشاهدة"
          min={0}
          max={Math.max(1, Math.floor(duration))}
          step={1}
          discrete={false}
          disabled={duration === 0}
          value={Math.min(Math.floor(time), Math.max(1, Math.floor(duration)))}
          format={formatTime}
          onChange={(v) => { if (ref.current) { ref.current.currentTime = v; setTime(v); } }}
        />
        <div className="text-nav-label dark:text-night-ink/60 mt-1 flex justify-between text-[11px] font-bold" dir="ltr"><span>{formatTime(time)}</span><span>{duration ? formatTime(duration) : "--:--"}</span></div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
        <RoundButton large label={playing ? "إيقاف مؤقت" : "تشغيل"} onClick={toggle}>{playing ? <PauseIcon className="h-7 w-7" /> : <PlayIcon className="h-7 w-7" />}</RoundButton>
        <RoundButton label="من الأول" onClick={() => { if (ref.current) { ref.current.currentTime = 0; setTime(0); } }}><RestartIcon className="h-5 w-5" /></RoundButton>
        <FavButton active={favs.includes(id)} onToggle={() => setFavs((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]))} label={clip.title} />
      </div>
      <div className="flex items-center justify-center gap-3 pt-4">
        <button type="button" aria-pressed={later.includes(id)} onClick={() => { setLater((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id])); showToast(later.includes(id) ? "اتشال من شاهد لاحقاً" : "اتضاف لشاهد لاحقاً"); }} className={`h-12 rounded-full px-5 text-[13px] font-extrabold transition-transform active:scale-95 ${later.includes(id) ? "bg-primary text-white" : "bg-rose-badge text-primary"}`}>شاهد لاحقاً</button>
        <button type="button" onClick={share} className="bg-gold-soft text-gold-ink h-12 rounded-full px-5 text-[13px] font-extrabold transition-transform active:scale-95">مشاركة</button>
      </div>
      <div className="pt-5"><Panel><p className="text-ink/70 dark:text-night-ink/70 text-right text-[12px] leading-6">مكان توقفك بيتحفظ على جهازك، وهتكمّل من نفس النقطة لما ترجع.</p></Panel></div>
      <p className="pt-4 text-center"><Link href="/videos" className="text-primary text-[13px] font-bold underline">كل الفيديوهات</Link></p>
      <DemoNote>ده فيديو تجريبي قصير مولَّد لتجربة المشغّل فقط، ومش محتوى كنسي. فيديوهات القسم هتتوصّل بمصادر معتمدة.</DemoNote>
    </section>
  );
}
