"use client";

import { useEffect } from "react";
import { localStore } from "@/shared/lib/storage";
import { readStored } from "@/shared/lib/useStored";

/**
 * Local reminder: only fires while the app is open in a browser tab/window,
 * because no push server or background service is connected. It does nothing
 * unless the user switched reminders on and the browser granted permission.
 */
export function ReminderRunner() {
  useEffect(() => {
    const tick = () => {
      try {
        if (localStore.getItem("notifyPrayers") !== "on") return;
        if (typeof Notification === "undefined" || Notification.permission !== "granted") return;
        const time = readStored<string>("reminderTime", "08:00", (v): v is string => typeof v === "string" && /^\d{2}:\d{2}$/.test(v));
        const now = new Date();
        const hhmm = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
        const day = now.toDateString();
        if (hhmm !== time || localStore.getItem("reminderLastDay") === day) return;
        localStore.setItem("reminderLastDay", day);
        new Notification("أنا أرثوذكسي", { body: "ده التذكير اللي ضبطته. افتح التطبيق وكمّل.", icon: "/icons/icon-192.png", lang: "ar", dir: "rtl" });
      } catch {
        /* notifications unavailable */
      }
    };
    const timer = setInterval(tick, 20000);
    return () => clearInterval(timer);
  }, []);
  return null;
}
