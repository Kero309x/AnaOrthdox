"use client";
import { useLayoutEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export function RouteMotion() {
  const pathname = usePathname();
  const first = useRef(true);
  useLayoutEffect(() => {
    if (first.current) {first.current=false; return;}
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const nodes = [...document.querySelectorAll<HTMLElement>("main > :not(nav)")];
    // Incoming content moves independently; the fixed navigation never slides.
    // Curves are the official web conversions of M3 expressive spatial/effects.
    const animations = nodes.flatMap(node => [
      node.animate([{opacity:0},{opacity:1}],{duration:200,easing:"cubic-bezier(0.34,0.8,0.34,1)"}),
      node.animate([{translate:"-10px 0"},{translate:"0 0"}],{duration:500,easing:"cubic-bezier(0.38,1.21,0.22,1)"}),
    ]);
    return () => animations.forEach(animation => animation.cancel());
  }, [pathname]);
  return null;
}
