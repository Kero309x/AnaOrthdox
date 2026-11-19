/** App-facing ports. These are local contracts, not claims about server endpoints. */
export interface FavoriteChurch { id: string; name: string; area: string; }
export interface ChurchFavoritesRepository {
  list(): FavoriteChurch[];
  save(churches: FavoriteChurch[]): boolean;
}
export interface ReadingContent {
  id: string; title: string; body: string; source: string; version: string;
}
export type ContentResult<T> = { status: 'available'; data: T } | { status: 'unavailable'; reason: string };
export interface ReadingRepository { get(date: string, slotId: string): Promise<ContentResult<ReadingContent>>; }
