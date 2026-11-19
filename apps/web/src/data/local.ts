import type { ChurchFavoritesRepository, FavoriteChurch, ReadingRepository } from './contracts';
import { localStore } from '../shared/lib/storage';
export function parseChurchFavorites(raw: string | null): FavoriteChurch[] {
  try {
    const list: unknown = JSON.parse(raw ?? '[]');
    if (!Array.isArray(list)) return [];
    const seen = new Set<string>();
    return list.filter((item): item is FavoriteChurch => {
      if (!item || typeof item !== 'object') return false;
      const x = item as Record<string, unknown>;
      if (typeof x.id !== 'string' || !x.id || x.id.length > 128 || seen.has(x.id) || typeof x.name !== 'string' || !x.name.trim() || x.name.length > 60 || typeof x.area !== 'string' || x.area.length > 60) return false;
      seen.add(x.id); return true;
    }).map(({id,name,area}) => ({id,name,area}));
  } catch { return []; }
}
export const churchFavorites: ChurchFavoritesRepository = {
  list: () => parseChurchFavorites(localStore.getItem('favChurches')),
  save: (churches) => localStore.setItem('favChurches', JSON.stringify(churches)),
};
/** No sample text is passed off as approved liturgical content. No fetch happens here. */
export const readings: ReadingRepository = {
  async get() { return {status: 'unavailable', reason: 'المحتوى محتاج مصدر ليتورجي معتمد'}; },
};
