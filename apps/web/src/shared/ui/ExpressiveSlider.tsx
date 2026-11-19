"use client";

import { useEffect, useRef, useState } from "react";
import type { M3eSliderElement, M3eSliderThumbElement } from "@m3e/web/slider";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "m3e-slider": React.HTMLAttributes<M3eSliderElement> & {ref: React.Ref<M3eSliderElement>; min:number;max:number;step:number;size:string;discrete:boolean};
      "m3e-slider-thumb": React.HTMLAttributes<M3eSliderThumbElement> & {ref: React.Ref<M3eSliderThumbElement>;value:number};
    }
  }
}

type Props = { value: number; min: number; max: number; step: number; onChange: (value: number) => void; label: string };
const digits = new Intl.NumberFormat("ar-EG", { useGrouping: false });

// The installed M3 Expressive implementation, not a circular native-range skin.
export function ExpressiveSlider({value,min,max,step,onChange,label}: Props) {
  const slider = useRef<M3eSliderElement>(null);
  const thumb = useRef<M3eSliderThumbElement>(null);
  const onChangeRef = useRef(onChange);
  const [ready, setReady] = useState(false);
  useEffect(() => { onChangeRef.current = onChange; }, [onChange]);
  useEffect(() => {
    let active = true;
    const host = slider.current;
    const change = () => { if (thumb.current) onChangeRef.current(thumb.current.value ?? min); };
    host?.addEventListener("input", change);
    import("@m3e/web/slider").then(() => {
      if (!active || !host) return;
      host.displayWith = (next) => `${digits.format(next ?? min)}٪`;
      setReady(true);
    });
    return () => {active=false; host?.removeEventListener("input",change);};
  }, [min]);
  useEffect(() => {if (ready && thumb.current) thumb.current.value=value;}, [ready,value]);
  return <div className="expressive-slider-wrap" data-ready={ready}>
    <m3e-slider ref={slider} min={min} max={max} step={step} size="small" discrete dir="rtl" className="expressive-slider">
      <m3e-slider-thumb ref={thumb} value={value} aria-label={label} aria-valuetext={`${digits.format(value)}٪`} />
    </m3e-slider>
  </div>;
}
