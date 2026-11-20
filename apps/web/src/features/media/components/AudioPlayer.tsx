"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { audioTracks } from "@/data/catalog";
import { TASBEHA_COLLECTION_ID, TASBEHA_PERFORMER, TASBEHA_SOURCE, tasbehaSunday } from "@/data/tasbeha";
import { ExpressiveSlider } from "@/shared/ui/ExpressiveSlider";
import { makeToneWavUrl } from "@/shared/lib/synth";
import { isStringArray, useStored } from "@/shared/lib/useStored";
import { DemoBadge, DemoNote, FavButton, RoundButton, Screen, formatTime, useShowToast } from "@/shared/ui/kit";
import { DownloadIcon, MusicIcon, PauseIcon, PlayIcon, RestartIcon, SkipBackIcon, SkipNextIcon } from "@/shared/ui/icons";

const none: string[] = [];
const SPEEDS = [0.75, 1, 1.25, 1.5];
const SLEEP = [0, 5, 10, 15];

type Playable = {
  id: string;
  title: string;
  artist: string;
  seconds: number;
  hz?: number;
  src?: string;
  sourcePage?: string;
  demo?: true;
  stream?: boolean;
};

const tasbehaPlaylist: Playable[] = tasbehaSunday.map((t) => ({
  id: t.id,
  title: t.title,
  artist: TASBEHA_PERFORMER,
  seconds: 0,
  src: t.src,
  sourcePage: t.sourcePage,
  stream: true,
}));

export default function AudioPlayer() {
  const params = useSearchParams();
  const collection = params.get("c") === TASBEHA_COLLECTION_ID ? TASBEHA_COLLECTION_ID : null;
  const list: Playable[] = collection ? tasbehaPlaylist : audioTracks;
  const kindParam = params.get("kind");
  const fallbackId = collection
    ? list[0].id
    : (audioTracks.find((t) => t.kind === kindParam)?.id ?? audioTracks[0].id);
  const id = params.get("id") ?? fallbackId;
  const index = Math.max(0, list.findIndex((t) => t.id === id));
  const track = list[index];
  return (
    <Screen title="المشغّل" backHref="/audio">
      <Player key={track.id} list={list} index={index} collection={collection} />
    </Screen>
  );
}

function Player({ list, index, collection }: { list: Playable[]; index: number; collection: string | null }) {
  const track = list[index];
  const router = useRouter();
  const showToast = useShowToast();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const urlRef = useRef<string | null>(null);
  const [src, setSrc] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(track.seconds);
  const [speed, setSpeed] = useState(1);
  const [repeat, setRepeat] = useState(false);
  const [sleepMin, setSleepMin] = useState(0);
  const [error, setError] = useState(false);
  const [favs, setFavs] = useStored("fav.audio", none, isStringArray);
  const [downloaded, setDownloaded] = useStored("downloaded.audio", none, isStringArray);
  const [, setRecent] = useStored("recent.audio", none, isStringArray);

  useEffect(() => {
    if (track.src) {
      urlRef.current = null;
      setSrc(track.src);
    } else {
      const url = makeToneWavUrl(track.hz ?? 440, track.seconds);
      urlRef.current = url;
      setSrc(url);
    }
    setRecent((p) => [track.id, ...p.filter((x) => x !== track.id)].slice(0, 5));
    return () => {
      if (urlRef.current) {
        URL.revokeObjectURL(urlRef.current);
        urlRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [track.id]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.playbackRate = speed;
  }, [speed, src]);

  useEffect(() => {
    if (!sleepMin) return;
    const timer = setTimeout(() => {
      audioRef.current?.pause();
      setSleepMin(0);
      showToast("وقف التشغيل بعد المؤقت");
    }, sleepMin * 60000);
    return () => clearTimeout(timer);
  }, [sleepMin, showToast]);

  const goTo = (i: number) => {
    const next = list[(i + list.length) % list.length];
    router.replace(collection ? `/audio/player?c=${collection}&id=${next.id}` : `/audio/player?id=${next.id}`);
  };
  const toggle = async () => {
    const a = audioRef.current;
    if (!a) return;
    try {
      if (error) {
        setError(false);
        a.load();
        await new Promise((res) => setTimeout(res, 300));
      }
      if (a.paused) await a.play();
      else a.pause();
    } catch {
      setError(true);
    }
  };
  const download = () => {
    if (!urlRef.current) return;
    const a = document.createElement("a");
    a.href = urlRef.current;
    a.download = `${track.id}-demo.wav`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setDownloaded((p) => (p.includes(track.id) ? p : [...p, track.id]));
    showToast("اتحمّل مقطع تجريبي على جهازك");
  };
  const pct = useMemo(() => (duration ? (time / duration) * 100 : 0), [time, duration]);

  return (
    <>
      <audio
        ref={audioRef}
        src={src ?? undefined}
        preload="metadata"
        loop={repeat}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => Number.isFinite(e.currentTarget.duration) && setDuration(e.currentTarget.duration)}
        onEnded={() => (index < list.length - 1 ? goTo(index + 1) : setPlaying(false))}
        onError={() => src && setError(true)}
      />
      <section className="px-6 pt-6">
        <div className="relative overflow-hidden rounded-[28px] bg-[linear-gradient(165deg,var(--hero-1)_0%,var(--hero-2)_45%,var(--hero-3)_100%)] dark:bg-[linear-gradient(165deg,var(--hero-1d)_0%,var(--hero-2d)_45%,var(--hero-3d)_100%)]">
          <span className="bg-starburst/40 absolute -top-16 -right-16 h-44 w-44 rounded-full" aria-hidden="true" />
          <span className="bg-starburst/40 absolute -bottom-14 -left-14 h-36 w-36 rounded-full" aria-hidden="true" />
          <div className="relative flex h-52 items-center justify-center">
            <span className={`flex h-20 w-20 items-center justify-center rounded-full bg-white/15 ${playing ? "animate-pulse" : ""}`}>
              <MusicIcon className="h-9 w-9 text-white" />
            </span>
          </div>
        </div>

        <div className="pt-5 text-center">
          <p className="text-ink dark:text-night-ink text-xl font-black">{track.title}</p>
          <p className="text-ink/55 dark:text-night-ink/55 mt-1 flex items-center justify-center gap-2 text-[12px]">
            {track.artist} {track.demo ? <DemoBadge /> : <span className="bg-rose-badge text-primary shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-extrabold">استماع أونلاين</span>}
          </p>
        </div>

        <div className="pt-6">
          <ExpressiveSlider
            label="موضع التشغيل"
            min={0}
            max={Math.max(1, Math.floor(duration))}
            step={1}
            discrete={false}
            value={Math.min(Math.floor(time), Math.max(1, Math.floor(duration)))}
            format={formatTime}
            onChange={(v) => {
              setTime(v);
              if (audioRef.current) audioRef.current.currentTime = v;
            }}
          />
          <div className="text-nav-label dark:text-night-ink/60 mt-1 flex justify-between text-[11px] font-bold" dir="rtl">
            <span>{formatTime(time)}</span>
            <span className="sr-only">{Math.round(pct)}%</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {error && <p role="alert" className="text-primary mt-2 text-center text-[12px] font-bold">تعذّر تحميل الصوت. اتأكد من اتصال الإنترنت واضغط تشغيل للمحاولة تاني.</p>}

        <div className="flex items-center justify-center gap-4 pt-5">
          <RoundButton label="السابق" onClick={() => goTo(index - 1)}><SkipBackIcon className="h-5 w-5" /></RoundButton>
          <RoundButton large label={playing ? "إيقاف مؤقت" : "تشغيل"} onClick={toggle}>
            {playing ? <PauseIcon className="h-7 w-7" /> : <PlayIcon className="h-7 w-7" />}
          </RoundButton>
          <RoundButton label="التالي" onClick={() => goTo(index + 1)}><SkipNextIcon className="h-5 w-5" /></RoundButton>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-6">
          <FavButton active={favs.includes(track.id)} onToggle={() => setFavs((p) => (p.includes(track.id) ? p.filter((x) => x !== track.id) : [...p, track.id]))} label={track.title} />
          <RoundButton label="تكرار" active={repeat} onClick={() => setRepeat((r) => !r)}><RestartIcon className="h-5 w-5" /></RoundButton>
          <button type="button" onClick={() => setSpeed((s) => SPEEDS[(SPEEDS.indexOf(s) + 1) % SPEEDS.length])} aria-label={`السرعة ${speed}`} className="bg-rose-badge text-primary h-12 min-w-12 rounded-full px-3 text-sm font-extrabold transition-transform active:scale-95" dir="ltr">
            {speed}x
          </button>
          <button type="button" onClick={() => setSleepMin((s) => SLEEP[(SLEEP.indexOf(s) + 1) % SLEEP.length])} aria-pressed={sleepMin > 0} className={`h-12 rounded-full px-4 text-[12px] font-extrabold transition-transform active:scale-95 ${sleepMin ? "bg-primary text-white" : "bg-rose-badge text-primary"}`}>
            {sleepMin ? `مؤقت ${sleepMin} د` : "مؤقت النوم"}
          </button>
        </div>

        {!track.stream && (
          <div className="flex justify-center pt-5">
            <button type="button" onClick={download} className="bg-gold-soft text-gold-ink flex items-center gap-2 rounded-full px-6 py-3 text-sm font-extrabold transition-transform active:scale-95">
              <DownloadIcon className="h-4 w-4" />
              {downloaded.includes(track.id) ? "محمّل، حمّله تاني" : "تنزيل"}
            </button>
          </div>
        )}
        {track.stream && track.sourcePage && (
          <p className="pt-4 text-center text-[11px]">
            <span className="text-ink/50 dark:text-night-ink/50">المصدر: {TASBEHA_SOURCE.name} · </span>
            <a href={track.sourcePage} target="_blank" rel="noopener noreferrer" className="text-primary font-bold underline">صفحة اللحن في الأرشيف</a>
          </p>
        )}
        <p className="pt-4 text-center"><Link href="/audio" className="text-primary text-[13px] font-bold underline">كل المقاطع</Link></p>
      </section>
      {track.demo ? (
        <DemoNote>المقطع صوت تجريبي مُولَّد داخل التطبيق لتجربة التشغيل والتحكم. المحتوى الفعلي هيتوصّل بمكتبة مرخّصة.</DemoNote>
      ) : (
        <p className="text-ink/50 dark:text-night-ink/50 px-8 pt-4 text-center text-[11px] leading-5">
          تشغيل تسجيل صوتي من أرشيف {TASBEHA_SOURCE.name} عبر الإنترنت. التنزيل غير متاح لهذه التسجيلات.
        </p>
      )}
    </>
  );
}
