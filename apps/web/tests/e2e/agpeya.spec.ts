import { expect, test } from '@playwright/test';

// Synthetic payload: the offline tests never contain real prayer text.
const fake = { id: 'prime', name: 'باكر', traditionalTime: '٦ صباحاً', items: [
  { type: 'prose', id: 'opening', kind: 'opening', title: 'مقدمة', lines: [{ text: 'سطر تجريبي' }, { text: 'رد تجريبي', response: true }] },
  { type: 'verses', id: 'p1', kind: 'psalm', title: 'مزمور تجريبي', verses: [{ num: 1, text: 'آية تجريبية' }] },
  { type: 'watch', id: 'w1', title: 'الخدمة الأولى', theme: 'سهر', blocks: [{ type: 'prose', id: 'x', kind: 'conclusion', title: 'ختام', lines: [{ text: 'نص ختام' }] }] },
] };

test('prayers list opens the reader and the reader renders sections in order', async ({ page }) => {
  await page.route('**/api/agpeya/baaker', (r) => r.fulfill({ json: fake }));
  await page.goto('/prayers');
  await page.getByRole('link', { name: 'اقرأ الصلاة' }).first().click();
  await expect(page).toHaveURL(/\/prayers\/baaker/);
  await expect(page.getByText('سطر تجريبي')).toBeVisible();
  await expect(page.getByText('آية تجريبية')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'الخدمة الأولى · سهر' })).toBeVisible();
  await expect(page.getByRole('link', { name: /الساعة التالية/ })).toHaveAttribute('href', '/prayers/thalitha');
  await page.getByRole('button', { name: 'علّم إنك صلّيت' }).click();
  await page.goto('/prayers');
  await expect(page.getByText('صلّيت ١ من ٧ النهاردة')).toBeVisible();
});

test('reader: failure shows honest error with retry and no substitute text, retry recovers', async ({ page }) => {
  let calls = 0;
  await page.route('**/api/agpeya/baaker', (r) => (++calls === 1 ? r.fulfill({ status: 502, json: { error: 'upstream_unavailable' } }) : r.fulfill({ json: fake })));
  await page.goto('/prayers/baaker');
  await expect(page.getByText('مقدرناش نحمّل نص الصلاة')).toBeVisible();
  await expect(page.getByText('سطر تجريبي')).toHaveCount(0);
  await page.getByRole('button', { name: 'جرّب تاني' }).click();
  await expect(page.getByText('سطر تجريبي')).toBeVisible();
});

test('reader: font control persists', async ({ page }) => {
  await page.route('**/api/agpeya/baaker', (r) => r.fulfill({ json: fake }));
  await page.goto('/prayers/baaker');
  await page.getByRole('button', { name: 'تكبير الخط' }).click();
  await page.reload();
  expect(await page.evaluate(() => localStorage.getItem('agpeyaFontScale'))).toBe('115');
});

test('unknown hour is a 404', async ({ page }) => {
  const res = await page.goto('/prayers/bogus');
  expect(res?.status()).toBe(404);
});

test('live API (AGPEYA_LIVE=1): every hour loads real text through the route', async ({ request }) => {
  test.skip(!process.env.AGPEYA_LIVE, 'needs network to api.coptic.io');
  for (const h of ['baaker', 'thalitha', 'sadisa', 'taseaa', 'ghoroub', 'noum', 'montasaf']) {
    const res = await request.get(`/api/agpeya/${h}`);
    expect(res.status(), h).toBe(200);
    const body = await res.json();
    expect(body.items.length, h).toBeGreaterThan(15);
  }
});

test('reader: shows source-gap notice and a contents list that jumps to a section; end of page clear of nav', async ({ page }) => {
  await page.route('**/api/agpeya/baaker', (r) => r.fulfill({ json: fake }));
  await page.goto('/prayers/baaker');
  if (process.env.NEXT_PUBLIC_AGPEYA_SOURCE === 'coptic-api') await expect(page.getByText('المصدر مش كامل لهذه الساعة')).toBeVisible();
  else await expect(page.getByText('المصدر مش كامل لهذه الساعة')).toHaveCount(0);
  await expect(page.getByText(/مصدر النص:/)).toBeVisible();
  await page.getByText(/فهرس الصلاة/).click();
  await page.getByRole('link', { name: 'الخدمة الأولى' }).click();
  await expect(page).toHaveURL(/#s-2$/);
  await page.getByRole('link', { name: 'للأعلى' }).scrollIntoViewIfNeeded();
  const link = await page.getByRole('link', { name: 'للأعلى' }).boundingBox();
  const nav = await page.locator('nav').last().boundingBox();
  expect(link && nav && link.y + link.height <= nav.y).toBeTruthy();
});

test('repeat block shows a tap counter up to its count and can restart', async ({ page }) => {
  const withRepeat = { ...fake, items: [{ type: 'prose', id: 'k', kind: 'repeat', title: 'تكرار تجريبي', rubric: '٣ مرة', repeat: 3, lines: [] }, ...fake.items] };
  await page.route('**/api/agpeya/baaker', (r) => r.fulfill({ json: withRepeat }));
  await page.goto('/prayers/baaker');
  const group = page.getByRole('group', { name: 'عدّاد التكرار' });
  await expect(group).toContainText('٠ من ٣');
  for (let i = 0; i < 5; i++) await group.getByRole('button', { name: 'عدّ' }).click();
  await expect(group).toContainText('٣ من ٣');
  await group.getByRole('button', { name: 'من الأول' }).click();
  await expect(group).toContainText('٠ من ٣');
});

test('bundled data: midnight index reaches psalms inside watches, number filter, deep link and resume', async ({ page }) => {
  test.skip(process.env.NEXT_PUBLIC_AGPEYA_SOURCE === 'coptic-api', 'bundled dataset only');
  await page.goto('/prayers/montasaf');
  await page.getByText(/فهرس الصلاة/).click();
  expect(await page.locator('details ul li').count()).toBeGreaterThan(40);
  await page.getByRole('searchbox', { name: 'دوّر في الفهرس' }).fill('118');
  await expect(page.locator('details ul li')).toHaveCount(1);
  await page.locator('details ul li a').click();
  await expect(page.getByRole('region', { name: /المزمور المائة والثامن عشر/ })).toBeInViewport();
  // deep link by hash scrolls after the text has loaded
  await page.goto('/prayers/baaker#s-10');
  await expect(page.locator('#s-10')).toBeInViewport();
  // resume: scroll down, leave, come back
  await page.mouse.wheel(0, 3000);
  await page.waitForTimeout(600);
  await page.goto('/prayers/baaker');
  await expect(page.getByRole('link', { name: /كمّل من حيث وقفت/ })).toBeVisible();
});

test('bundled data: gospel jump, resume is per hour, survives reload and back', async ({ page }) => {
  test.skip(process.env.NEXT_PUBLIC_AGPEYA_SOURCE === 'coptic-api', 'bundled dataset only');
  await page.goto('/prayers/thalitha');
  await page.getByText(/فهرس الصلاة/).click();
  await page.getByRole('link', { name: 'انجيل الساعة الثالثة' }).click();
  await expect(page.getByRole('region', { name: 'انجيل الساعة الثالثة' })).toBeInViewport();
  await page.mouse.wheel(0, 600);
  await page.waitForTimeout(600);
  await page.reload();
  await expect(page.getByRole('link', { name: /كمّل من حيث وقفت/ })).toBeVisible();
  await page.goto('/prayers/sadisa');
  await expect(page.getByRole('link', { name: /كمّل من حيث وقفت/ })).toHaveCount(0);
  await page.goBack();
  await expect(page).toHaveURL(/thalitha/);
  await expect(page.getByRole('link', { name: /كمّل من حيث وقفت/ })).toBeVisible();
});
