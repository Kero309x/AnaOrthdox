export interface KeyValueStorage { getItem(key: string): string | null; setItem(key: string, value: string): void; removeItem(key: string): void; }
export function createSafeStorage(resolve: () => KeyValueStorage | null) {
  return {
    getItem(key: string): string | null { try { return resolve()?.getItem(key) ?? null; } catch { return null; } },
    setItem(key: string, value: string): boolean { try { const s = resolve(); if (!s) return false; s.setItem(key, value); return true; } catch { return false; } },
    removeItem(key: string): boolean { try { const s = resolve(); if (!s) return false; s.removeItem(key); return true; } catch { return false; } },
  };
}
export const localStore = createSafeStorage(() => typeof window === 'undefined' ? null : window.localStorage);
