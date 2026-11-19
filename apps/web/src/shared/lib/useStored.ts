"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import { localStore } from "@/shared/lib/storage";

const listeners = new Set<() => void>();
const PREFIX = "ana.";

function subscribe(callback: () => void) {
  listeners.add(callback);
  const onStorage = (event: StorageEvent) => {
    if (event.key === null || event.key.startsWith(PREFIX)) callback();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", onStorage);
  };
}

function emit() {
  listeners.forEach((listener) => listener());
}

/** Read a saved JSON value; any bad data falls back instead of crashing. */
export function readStored<T>(key: string, fallback: T, validate?: (value: unknown) => value is T): T {
  try {
    const raw = localStore.getItem(PREFIX + key);
    if (raw === null) return fallback;
    const value: unknown = JSON.parse(raw);
    if (validate && !validate(value)) return fallback;
    return value as T;
  } catch {
    return fallback;
  }
}

export function writeStored<T>(key: string, value: T): boolean {
  const ok = localStore.setItem(PREFIX + key, JSON.stringify(value));
  if (!ok && typeof window !== "undefined") window.dispatchEvent(new Event("ana:storage-failed"));
  emit();
  return ok;
}

export function clearAllStored(): void {
  if (typeof window === "undefined") return;
  try {
    const keys: string[] = [];
    for (let i = 0; i < window.localStorage.length; i++) {
      const k = window.localStorage.key(i);
      if (k && k.startsWith(PREFIX)) keys.push(k);
    }
    keys.forEach((k) => window.localStorage.removeItem(k));
  } catch {
    /* storage unavailable */
  }
  emit();
}

/** Export every saved Ana value as one object (for the user's own backup). */
export function exportAllStored(): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  if (typeof window === "undefined") return out;
  try {
    for (let i = 0; i < window.localStorage.length; i++) {
      const k = window.localStorage.key(i);
      if (k && k.startsWith(PREFIX)) {
        try {
          out[k.slice(PREFIX.length)] = JSON.parse(window.localStorage.getItem(k) ?? "null");
        } catch {
          /* skip unreadable */
        }
      }
    }
  } catch {
    /* storage unavailable */
  }
  return out;
}

/** Saved state shared across components and tabs. `fallback` must be a stable constant. */
export function useStored<T>(
  key: string,
  fallback: T,
  validate?: (value: unknown) => value is T,
): [T, (next: T | ((prev: T) => T)) => void] {
  const raw = useSyncExternalStore(
    subscribe,
    () => localStore.getItem(PREFIX + key),
    () => null,
  );
  const value = useMemo(() => {
    if (raw === null) return fallback;
    try {
      const parsed: unknown = JSON.parse(raw);
      if (validate && !validate(parsed)) return fallback;
      return parsed as T;
    } catch {
      return fallback;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [raw, fallback]);
  const set = useCallback(
    (next: T | ((prev: T) => T)) => {
      const prev = readStored(key, fallback, validate);
      const resolved = typeof next === "function" ? (next as (p: T) => T)(prev) : next;
      writeStored(key, resolved);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [key, fallback],
  );
  return [value, set];
}

export const isStringArray = (v: unknown): v is string[] => Array.isArray(v) && v.every((x) => typeof x === "string");
export const isRecord = (v: unknown): v is Record<string, unknown> => !!v && typeof v === "object" && !Array.isArray(v);
