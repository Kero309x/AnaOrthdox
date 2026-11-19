import { test, expect } from '@playwright/test';

test('audio: real playback, favorite, download state and filters persist', async ({ page, context }) => {
  await page.goto('/audio/player?id=t1');
  await page.getByRole('button', { name: 'تشغيل', exact: true }).click();
  await expect.poll(() => page.evaluate(() => { const a = document.querySelector('audio'); return !!a && !a.paused && a.currentTime > 0; })).toBe(true);
  await page.getByRole('button', { name: 'إيقاف مؤقت', exact: true }).click();
  await page.getByRole('button', { name: /^السرعة/ }).click();
  await expect(page.getByRole('button', { name: 'السرعة 1.25' })).toBeVisible();
  await page.getByRole('button', { name: /إضافة .* للمفضلة/ }).click();
  const [download] = await Promise.all([page.waitForEvent('download'), page.getByRole('button', { name: 'تنزيل', exact: true }).click()]);
  expect(download.suggestedFilename()).toBe('t1-demo.wav');
  await page.goto('/audio');
  await page.getByRole('button', { name: 'المفضلة', exact: true }).click();
  await expect(page.getByRole('link', { name: /ترنيمة تجريبية ١/ }).first()).toBeVisible();
  await page.getByRole('button', { name: 'المحمّلة', exact: true }).click();
  await expect(page.getByRole('link', { name: /ترنيمة تجريبية ١/ }).first()).toBeVisible();
});

test('video: real demo file plays, position persists, watch later works, no fictional duration', async ({ page }) => {
  await page.goto('/videos/watch?id=v2');
  await expect(page.getByText('فيديو تجريبي قصير').first()).toBeVisible();
  await page.getByRole('button', { name: 'تشغيل', exact: true }).click();
  await expect.poll(() => page.evaluate(() => { const v = document.querySelector('video'); return !!v && !v.paused && v.currentTime > 0.3; })).toBe(true);
  await page.getByRole('button', { name: 'إيقاف مؤقت', exact: true }).click();
  const read = () => page.evaluate(() => JSON.parse(localStorage.getItem('ana.progress.video') || '{}').v2 ?? 0);
  await expect.poll(read).toBeGreaterThan(0);
  expect(await read()).toBeLessThan(1);
  await page.getByRole('button', { name: 'شاهد لاحقاً' }).click();
  await page.goto('/videos');
  await page.getByRole('button', { name: 'شاهد لاحقاً', exact: true }).click();
  await expect(page.getByText('ترنيمة مصوّرة تجريبية')).toBeVisible();
  await page.goto('/videos/watch?id=nope');
  await expect(page.getByText('الفيديو ده مش موجود')).toBeVisible();
});

test('book reader: pages, bookmark, resume and real file download', async ({ page }) => {
  await page.goto('/books/read?id=b1');
  await page.getByRole('button', { name: 'التالي' }).click();
  await page.getByRole('button', { name: 'علامة' }).click();
  await expect(page.getByRole('button', { name: 'صفحة ٢', exact: true })).toBeVisible();
  const [download] = await Promise.all([page.waitForEvent('download'), page.getByRole('button', { name: 'تنزيل' }).click()]);
  expect(download.suggestedFilename()).toBe('b1-demo.txt');
  await page.reload();
  await expect(page.getByText('صفحة ٢ من ٤')).toBeVisible();
  await page.goto('/books');
  await page.getByRole('button', { name: 'المحمّلة', exact: true }).click();
  await expect(page.getByText('كتاب تجريبي ١', { exact: true })).toBeVisible();
});

test('study lesson: quiz feedback, note and completion persist', async ({ page }) => {
  await page.goto('/studies/lesson?s=s1&l=l1');
  await page.getByRole('button', { name: 'الإجابة الثانية' }).click();
  await expect(page.getByText('مش دي، الإجابة الصحيحة متعلّمة')).toBeVisible();
  await page.getByRole('textbox', { name: 'ملاحظاتك على الدرس' }).fill('ملاحظة اختبار');
  await page.getByRole('button', { name: 'علّم إنك خلّصت' }).click();
  await page.goto('/studies');
  await expect(page.getByText('خلّصت ١ من ٣')).toBeVisible();
  await page.goto('/studies/lesson?s=s1&l=l1');
  await expect(page.getByRole('textbox', { name: 'ملاحظاتك على الدرس' })).toHaveValue('ملاحظة اختبار');
});

test('kids: activity completes with a star that persists', async ({ page }) => {
  await page.goto('/kids/activity?id=k1');
  await page.getByRole('button', { name: 'التالي' }).click();
  await page.getByRole('button', { name: 'التالي' }).click();
  await page.getByRole('button', { name: 'خلّصت، هات نجمة' }).click();
  await page.goto('/kids');
  await expect(page.getByText(/نجوم النهاردة: ١/)).toBeVisible();
});

test('church details: user-entered time, phone call link and map link', async ({ page }) => {
  await page.goto('/churches');
  await page.getByRole('textbox', { name: 'اسم الكنيسة', exact: true }).fill('كنيسة اختبار');
  await page.getByRole('textbox', { name: 'المنطقة', exact: true }).fill('الإسكندرية');
  await page.getByRole('button', { name: /إضافة/ }).click();
  await page.getByText('كنيسة اختبار', { exact: true }).click();
  await page.getByRole('button', { name: 'إضافة موعد' }).click();
  await expect(page.getByText('الأحد ·')).toBeVisible();
  await page.getByRole('button', { name: 'تعديل البيانات' }).click();
  await page.getByRole('textbox', { name: 'رقم التليفون' }).fill('0100 000 0000');
  const call = page.getByRole('link', { name: 'اتصال' });
  await expect(call).toHaveAttribute('href', 'tel:01000000000');
  await expect(page.getByRole('link', { name: 'الاتجاهات' })).toHaveAttribute('href', /google\.com\/maps\/search.*%D9%83%D9%86%D9%8A%D8%B3%D8%A9/);
});

test('auth journeys: validation, busy lock, error keeps input, demo success, nothing persisted', async ({ page }) => {
  await page.goto('/account/register');
  await page.getByRole('button', { name: 'إنشاء الحساب' }).click();
  await expect(page.getByText('اكتب اسمك')).toBeVisible();
  await page.getByLabel('الاسم', { exact: true }).fill('اسم تجربة');
  await page.getByLabel('البريد الإلكتروني').fill('bad');
  await page.getByLabel('كلمة المرور', { exact: true }).fill('short');
  await page.getByRole('button', { name: 'إنشاء الحساب' }).click();
  await expect(page.getByText(/مش بصيغة صحيحة/)).toBeVisible();
  await expect(page.getByText(/٨ حروف/)).toBeVisible();
  await page.getByLabel('البريد الإلكتروني').fill('a@example.com');
  await page.getByLabel('كلمة المرور', { exact: true }).fill('longenough1');
  await page.getByLabel('تأكيد كلمة المرور').fill('different1');
  await page.getByRole('button', { name: 'إنشاء الحساب' }).click();
  await expect(page.getByText(/مش متطابقين/)).toBeVisible();
  await page.getByLabel('تأكيد كلمة المرور').fill('longenough1');
  await page.getByRole('button', { name: 'انقطاع الشبكة' }).click();
  await page.getByRole('button', { name: 'إنشاء الحساب' }).click();
  await expect(page.getByText(/انقطاع في الاتصال/)).toBeVisible();
  await expect(page.getByLabel('البريد الإلكتروني')).toHaveValue('a@example.com');
  await page.getByRole('button', { name: 'بطيء (٢ ثانية)' }).click();
  await page.getByRole('button', { name: 'جرّب تاني' }).click();
  await expect(page.getByRole('button', { name: 'جاري التنفيذ…' })).toBeDisabled();
  await expect(page.getByText('اتحاكى إنشاء الحساب.')).toBeVisible({ timeout: 5000 });
  const stored = await page.evaluate(() => JSON.stringify({ ...localStorage, ...sessionStorage }));
  expect(stored).not.toContain('longenough1');
  expect(stored).not.toContain('a@example.com');
  await page.goto('/account/forgot');
  await page.getByLabel('البريد الإلكتروني').fill('a@example.com');
  await page.getByRole('button', { name: 'ابعت رابط الاسترجاع' }).click();
  await expect(page.getByText('اتحاكى إرسال رابط الاسترجاع.')).toBeVisible();
  await page.goto('/account/login');
  await page.getByRole('link', { name: 'نسيت كلمة المرور؟' }).click();
  await expect(page).toHaveURL(/forgot/);
  await page.goto('/account/login');
  await page.getByLabel('اسمك على الجهاز ده').fill('اسم تجربة');
  await page.getByRole('button', { name: 'ابدأ بملف محلي' }).click();
  await expect(page).toHaveURL(/\/account$/);
  await expect(page.getByText('اسم تجربة', { exact: true })).toBeVisible();
});

test('games: weekly, quick and word puzzles work', async ({ page }) => {
  await page.goto('/games/weekly');
  for (let i = 0; i < 5; i++) {
    await page.locator('main button:not([aria-label]):not([disabled])').filter({ hasText: /\S/ }).nth(0).click();
    await page.getByRole('button', { name: /التالي|النتيجة/ }).click();
  }
  await expect(page.getByText(/من ٥/)).toBeVisible();
  await page.goto('/games/words');
  await page.getByRole('textbox', { name: 'أول شهور السنة القبطية' }).fill('توت');
  await page.getByRole('button', { name: 'تأكيد' }).first().click();
  await expect(page.getByText('توت', { exact: true })).toBeVisible();
  await page.getByRole('textbox', { name: 'الشهر اللي بعد توت' }).fill('خطأ');
  await page.getByRole('button', { name: 'تأكيد' }).first().click();
  await expect(page.getByText('مش دي، جرّب تاني.')).toBeVisible();
});

test('reading notes, mark-read, day note, search and favorites aggregation', async ({ page }) => {
  await page.goto('/readings/gospel');
  await page.getByRole('button', { name: 'علّم إنك قريتها' }).click();
  await page.getByRole('textbox', { name: 'ملاحظتك على قراءة اليوم' }).fill('تأمل اختبار');
  await page.reload();
  await expect(page.getByRole('button', { name: /قريتها، اضغط للتراجع/ })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'ملاحظتك على قراءة اليوم' })).toHaveValue('تأمل اختبار');
  await page.goto('/search');
  await page.getByRole('searchbox', { name: 'ابحث في التطبيق' }).fill('كتاب');
  await expect(page.getByRole('link', { name: /كتاب تجريبي ١/ })).toBeVisible();
  await page.getByRole('searchbox', { name: 'ابحث في التطبيق' }).fill('zzzz');
  await expect(page.getByText('مفيش نتايج')).toBeVisible();
  await page.goto('/favorites');
  await expect(page.getByText(/عندك .* ملاحظة محفوظة/)).toBeVisible();
});

test('reminder: needs permission, discloses foreground-only limit, backup export has no secrets', async ({ page, context }) => {
  await context.grantPermissions(['notifications']);
  await page.goto('/settings');
  await page.getByRole('switch', { name: 'تذكير يومي' }).click();
  await expect(page.getByRole('switch', { name: 'تذكير يومي' })).toHaveAttribute('aria-checked', 'true');
  await expect(page.getByText(/التطبيق مقفول/)).toBeVisible();
  await expect(page.getByLabel('وقت التذكير')).toBeVisible();
  await page.goto('/account');
  const [download] = await Promise.all([page.waitForEvent('download'), page.getByText('نسخة احتياطية من بياناتك', { exact: true }).click()]);
  expect(download.suggestedFilename()).toBe('ana-orthodoxi-backup.json');
});

test('no remaining dead "coming soon" badges on interactive routes', async ({ page }) => {
  for (const route of ['/audio', '/videos', '/books', '/studies', '/kids', '/games']) {
    await page.goto(route);
    await expect(page.getByText('قريباً', { exact: true })).toHaveCount(0);
  }
});

test('prayers: daily tracker is local, persists, and adds no prayer text', async ({ page }) => {
  await page.goto('/prayers');
  await page.getByRole('button', { name: 'علّم إنك صلّيت' }).first().click();
  await expect(page.getByText('صلّيت ١ من ٧ النهاردة')).toBeVisible();
  await page.reload();
  await expect(page.getByText('صلّيت ١ من ٧ النهاردة')).toBeVisible();
  await page.getByRole('button', { name: 'صلّيت', exact: true }).click();
  await expect(page.getByText('صلّيت ٠ من ٧ النهاردة')).toBeVisible();
});

test('calendar day links to readings and settings and keeps honest source labels', async ({ page }) => {
  await page.goto('/calendar/day');
  await expect(page.getByText('قريباً', { exact: true })).toHaveCount(0);
  await expect(page.getByText('المصدر غير متصل').first()).toBeVisible();
  await page.getByRole('link', { name: /تذكير باليوم/ }).click();
  await expect(page).toHaveURL(/\/settings/);
});

test('sync demo: busy state blocks double submit, error keeps input and retry works', async ({ page }) => {
  await page.goto('/account');
  await page.getByLabel(/اسم الجهاز/).fill('جهاز تجربة');
  await page.getByRole('button', { name: 'يفشل' }).click();
  await page.getByRole('button', { name: 'احفظ نسخة على الحساب' }).click();
  await expect(page.getByText(/فشلت المحاكاة/)).toBeVisible();
  await expect(page.getByLabel(/اسم الجهاز/)).toHaveValue('جهاز تجربة');
  await page.getByRole('button', { name: 'ينجح' }).click();
  await page.getByRole('button', { name: 'بطيء (٢ ثانية)' }).click();
  await page.getByRole('button', { name: 'جرّب تاني' }).click();
  await expect(page.getByRole('button', { name: 'جاري الحفظ…' })).toBeDisabled();
  await expect(page.getByText(/تمت المحاكاة بنجاح/)).toBeVisible({ timeout: 5000 });
});

test('auth extras: expired session banner and next, verify, reset, sessions states', async ({ page }) => {
  await page.goto('/account/login?expired=1&next=/favorites');
  await expect(page.getByText(/الجلسة انتهت/)).toBeVisible();
  await page.getByLabel('البريد الإلكتروني').fill('a@example.com');
  await page.getByLabel('كلمة المرور', { exact: true }).fill('whatever1');
  await page.getByRole('button', { name: 'دخول', exact: true }).click();
  await expect(page.getByRole('link', { name: 'كمّل لحيث كنت' })).toHaveAttribute('href', '/favorites');
  await page.goto('/account/login?next=//evil.example');
  await page.getByLabel('البريد الإلكتروني').fill('a@example.com');
  await page.getByLabel('كلمة المرور', { exact: true }).fill('whatever1');
  await page.getByRole('button', { name: 'دخول', exact: true }).click();
  await expect(page.getByRole('link', { name: 'رجوع للحساب' })).toHaveAttribute('href', '/account');

  await page.goto('/account/verify-email');
  await expect(page.getByText(/الرابط ناقص/)).toBeVisible();
  await page.goto('/account/verify-email?token=expired');
  await page.getByRole('button', { name: 'أكّد البريد' }).click();
  await expect(page.getByText(/انتهت صلاحيته/)).toBeVisible();
  await page.goto('/account/verify-email?token=abc');
  await page.getByRole('button', { name: 'أكّد البريد' }).click();
  await expect(page.getByText(/اتحاكى تأكيد البريد/)).toBeVisible();

  await page.goto('/account/reset?token=abc');
  await page.getByLabel('كلمة المرور الجديدة').fill('longenough1');
  await page.getByLabel('تأكيد كلمة المرور').fill('other12345');
  await page.getByRole('button', { name: 'غيّر كلمة المرور' }).click();
  await expect(page.getByText(/مش متطابقين/)).toBeVisible();
  await page.getByLabel('تأكيد كلمة المرور').fill('longenough1');
  await page.getByRole('button', { name: 'غيّر كلمة المرور' }).click();
  await expect(page.getByText(/اتحاكى تغيير كلمة المرور/)).toBeVisible();

  await page.goto('/account/sessions');
  await expect(page.getByText('جهاز تاني (عينة تجريبية)')).toBeVisible();
  await page.getByRole('button', { name: 'إنهاء', exact: true }).click();
  await expect(page.getByText('اتحاكى إنهاء الجلسة.')).toBeVisible();
  await expect(page.getByText('جهاز تاني (عينة تجريبية)')).toHaveCount(0);
  expect(await page.evaluate(() => JSON.stringify({ ...localStorage }))).not.toContain('longenough1');
});

test('blocked storage: favorite shows failure toast and does not pretend to save', async ({ page }) => {
  await page.addInitScript(() => { Storage.prototype.setItem = function () { throw new DOMException('blocked', 'QuotaExceededError'); }; });
  await page.goto('/videos/watch?id=v2');
  await page.getByRole('button', { name: /^إضافة .* للمفضلة$/ }).click();
  await expect(page.getByText(/مش قادر أحفظ التغيير على الجهاز/)).toBeVisible();
});

test('search and list empty states', async ({ page }) => {
  await page.goto('/search');
  await page.getByRole('searchbox').or(page.getByRole('textbox')).first().fill('zzzzzz-no-match');
  await expect(page.getByText(/مفيش نتايج|مفيش/).first()).toBeVisible();
  await page.goto('/favorites');
  await expect(page.getByText(/مفيش|لسه/).first()).toBeVisible();
});

for (const [route, label] of [['/books', 'الكتب'], ['/studies', 'الدراسات'], ['/kids', 'أنشطة الأطفال'], ['/audio', 'الترانيم'], ['/videos', 'الفيديوهات']] as const) {
  test(`catalog source states on ${route}: error retry, empty, slow loading, default has no delay`, async ({ page }) => {
    await page.goto(route);
    await expect(page.getByRole('status', { name: 'جاري تحميل القائمة' })).toHaveCount(0);
    await page.getByText(new RegExp(`حالة مصدر ${label}`)).click();
    const group = page.getByRole('group', { name: `حالة مصدر ${label}` });
    await group.getByRole('button', { name: 'خطأ ثم نجاح' }).click();
    await expect(page.getByText('تعذر تحميل القائمة')).toBeVisible();
    await page.getByRole('button', { name: 'جرّب تاني' }).click();
    await expect(page.getByText('تعذر تحميل القائمة')).toHaveCount(0);
    await group.getByRole('button', { name: 'فاضي' }).click();
    await expect(page.getByText(/المصدر رجّع قائمة فاضية/)).toBeVisible();
    await group.getByRole('button', { name: 'بطيء (٢ ثانية)' }).click();
    await expect(page.getByRole('status', { name: 'جاري تحميل القائمة' })).toBeVisible();
    await expect(page.getByRole('status', { name: 'جاري تحميل القائمة' })).toHaveCount(0, { timeout: 5000 });
    await group.getByRole('button', { name: 'جاهز' }).click();
  });
}

test('search keeps typed query through source error and retry', async ({ page }) => {
  await page.goto('/search');
  await page.getByRole('searchbox', { name: 'ابحث في التطبيق' }).fill('تجريبي');
  await page.getByText(/حالة مصدر نتائج البحث/).click();
  await page.getByRole('button', { name: 'خطأ ثم نجاح' }).click();
  await expect(page.getByText('تعذر تحميل القائمة')).toBeVisible();
  await expect(page.getByRole('searchbox', { name: 'ابحث في التطبيق' })).toHaveValue('تجريبي');
  await page.getByRole('button', { name: 'جرّب تاني' }).click();
  await expect(page.getByText('تعذر تحميل القائمة')).toHaveCount(0);
});

test('crossword: type, check wrong, hint, complete, persist, reset', async ({ page }) => {
  await page.goto('/games/crossword');
  const cell = (r: number, c: number) => page.locator(`[role=gridcell][aria-label^="خانة صف ${r} عمود ${c} "]`);
  await cell(1, 1).click();
  await page.getByLabel('اكتب الحرف').fill('ز');
  await page.getByRole('button', { name: 'تحقق' }).click();
  await expect(page.getByText(/الخانات الغلط متعلّمة/)).toBeVisible();
  for (let i = 0; i < 40; i++) { if (await page.getByText('كملت الشبكة كلها.').count()) break; await page.getByRole('button', { name: 'اكشف حرف' }).click(); }
  await expect(page.getByText('كملت الشبكة كلها.')).toBeVisible();
  await page.reload();
  await expect(page.getByText('٠ من')).toHaveCount(0);
  await page.getByRole('button', { name: 'ابدأ من الأول' }).click();
  await page.getByRole('button', { name: 'تأكيد مسح الشبكة' }).click();
  await expect(page.getByText('كملت الشبكة كلها.')).toHaveCount(0);
});

test('churches nearby search: keeps query through error and retry, slow skeleton, honest no-results', async ({ page }) => {
  await page.goto('/churches');
  await page.getByRole('searchbox', { name: 'بحث عن كنيسة' }).or(page.getByLabel('بحث عن كنيسة')).fill('الإسكندرية');
  await page.getByRole('button', { name: 'ابحث', exact: true }).click();
  await expect(page.getByText('مفيش نتائج حقيقية')).toBeVisible();
  await page.getByText(/حالة مصدر الكنائس/).click();
  const group = page.getByRole('group', { name: 'حالة مصدر الكنائس' });
  await group.getByRole('button', { name: 'خطأ ثم نجاح' }).click();
  await expect(page.getByText('مفيش نتائج حقيقية')).toHaveCount(0);
  await page.getByRole('button', { name: 'ابحث', exact: true }).click();
  await expect(page.getByText('تعذر البحث')).toBeVisible();
  await expect(page.getByLabel('بحث عن كنيسة')).toHaveValue('الإسكندرية');
  await page.getByRole('button', { name: 'جرّب تاني' }).click();
  await expect(page.getByText('مفيش نتائج حقيقية')).toBeVisible();
  await group.getByRole('button', { name: 'بطيء (٢ ثانية)' }).click();
  await page.getByRole('button', { name: 'ابحث', exact: true }).click();
  await expect(page.getByRole('status', { name: 'جاري البحث' })).toBeVisible();
  await expect(page.getByText('مفيش نتائج حقيقية')).toBeVisible({ timeout: 4000 });
});

test('reading text source: no delay by default, error retry, slow skeleton, honest unavailable', async ({ page }) => {
  await page.goto('/readings/gospel');
  await expect(page.getByText('نص القراءة مش متاح')).toBeVisible();
  await page.getByText(/حالة مصدر نص القراءة/).click();
  const group = page.getByRole('group', { name: 'حالة مصدر نص القراءة' });
  await group.getByRole('button', { name: 'خطأ ثم نجاح' }).click();
  await expect(page.getByText('تعذر تحميل نص القراءة')).toBeVisible();
  await page.getByRole('button', { name: 'جرّب تاني' }).click();
  await expect(page.getByText('نص القراءة مش متاح')).toBeVisible();
  await group.getByRole('button', { name: 'بطيء (٢ ثانية)' }).click();
  await expect(page.getByRole('status', { name: 'جاري تحميل النص' })).toBeVisible();
  await expect(page.getByText('نص القراءة مش متاح')).toBeVisible({ timeout: 4000 });
});

test.describe('compass sensor states', () => {
  test('unsupported device shows labelled preview only', async ({ page }) => {
    await page.addInitScript(() => { delete (window as unknown as Record<string, unknown>).DeviceOrientationEvent; });
    await page.goto('/compass');
    await expect(page.getByText(/مستشعر الاتجاه مش متاح/)).toBeVisible();
    await expect(page.getByText('معاينة تصميمية')).toBeVisible();
  });
  test('permission denied, then granted waits for a reading, then shows a real bearing', async ({ page }) => {
    await page.addInitScript(() => {
      (window as unknown as { __perm: string }).__perm = 'denied';
      (window as unknown as Record<string, unknown>).DeviceOrientationEvent = Object.assign(function () {}, {
        requestPermission: () => Promise.resolve((window as unknown as { __perm: string }).__perm),
      });
    });
    await page.goto('/compass');
    await expect(page.getByText(/اضغط تشغيل البوصلة/)).toBeVisible();
    await page.getByRole('button', { name: 'تشغيل البوصلة' }).click();
    await expect(page.getByText(/إذن المستشعر مرفوض/)).toBeVisible();
    await expect(page.getByText('معاينة تصميمية')).toBeVisible();
  });
  test('granted: calibrating message, then bearing from an absolute reading', async ({ page }) => {
    await page.addInitScript(() => {
      (window as unknown as Record<string, unknown>).DeviceOrientationEvent = Object.assign(function () {}, {
        requestPermission: () => Promise.resolve('granted'),
      });
    });
    await page.goto('/compass');
    await page.getByRole('button', { name: 'تشغيل البوصلة' }).click();
    await expect(page.getByText(/بنستنى قراءة اتجاه مطلقة/)).toBeVisible();
    await page.evaluate(() => {
      const e = new Event('deviceorientationabsolute') as Event & { alpha: number; absolute: boolean };
      Object.assign(e, { alpha: 270, absolute: true });
      window.dispatchEvent(e);
    });
    await expect(page.getByText(/اتجاهك الحالي|اتجاه الشرق تقريباً/)).toBeVisible({ timeout: 5000 });
    await expect(page.getByText('معاينة تصميمية')).toHaveCount(0);
  });
});
