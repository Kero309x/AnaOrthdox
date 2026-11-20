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
    // Fade only. The M3 spatial slide used to animate `translate` on these
    // siblings of the fixed bottom nav, and on mobile Chrome that knocked the
    // nav ~22px below the viewport (labels clipped) for the whole 500ms slide
    // on every tab switch. Opacity-only keeps a calm entrance and leaves the
    // fixed chrome untouched.
    const animations = nodes.flatMap(node => [
      node.animate([{opacity:0},{opacity:1}],{duration:200,easing:"cubic-bezier(0.34,0.8,0.34,1)"}),
    ]);
    return () => animations.forEach(animation => animation.cancel());
  }, [pathname]);
  return null;
}
