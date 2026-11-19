export type Environment = Record<string, unknown>;
export const DEVELOPMENT_JWT_SECRET = 'dev-ana-orthodox-jwt-secret-do-not-use-in-production-min-32-chars';
export function validateEnvironment(env: Environment): Environment {
  const production = env.NODE_ENV === 'production';
  const port = String(env.API_PORT ?? '3001');
  if (!/^\d+$/.test(port) || Number(port) < 1 || Number(port) > 65535) throw new Error('API_PORT must be an integer between 1 and 65535');
  const database = String(env.DATABASE_URL ?? '');
  if (production && !database) throw new Error('DATABASE_URL is required in production');
  if (database) {
    let url: URL; try { url = new URL(database); } catch { throw new Error('DATABASE_URL must be a PostgreSQL URL'); }
    if (!['postgresql:', 'postgres:'].includes(url.protocol)) throw new Error('DATABASE_URL must be a PostgreSQL URL');
  }
  const origins = String(env.CORS_ORIGINS ?? (production ? '' : 'http://localhost:3000')).split(',').map(x=>x.trim()).filter(Boolean);
  if (!origins.length) throw new Error('CORS_ORIGINS must list explicit origins');
  for (const raw of origins) {
    let url: URL; try { url = new URL(raw); } catch { throw new Error('CORS_ORIGINS contains an invalid origin'); }
    if (!['http:', 'https:'].includes(url.protocol) || url.origin !== raw) throw new Error('CORS_ORIGINS must contain origins without paths');
    if (production && url.protocol !== 'https:') throw new Error('Production CORS_ORIGINS must use HTTPS');
  }
  resolveJwtSecret(env.JWT_SECRET, production);
  return {...env, API_PORT: Number(port), CORS_ORIGINS: origins.join(',')};
}
export function resolveJwtSecret(value: unknown, production: boolean): string {
  const secret = typeof value === 'string' ? value.trim() : '';
  if (production && (secret.length < 32 || secret === DEVELOPMENT_JWT_SECRET || /REPLACE|CHANGE_ME|YOUR_SECRET/i.test(secret))) throw new Error('Production JWT_SECRET must be a non-placeholder secret of at least 32 characters');
  return secret || DEVELOPMENT_JWT_SECRET;
}
