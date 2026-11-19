import {test,expect} from '@playwright/test';
const routes=['/','/sections','/prayers','/readings','/readings/gospel','/calendar','/calendar/day?y=1743&m=3&d=10','/audio','/audio/player','/videos','/kids','/studies','/books','/churches','/churches/missing','/games','/games/quiz','/games/memory','/compass','/account','/settings'];
for(const [i,route] of routes.entries())test(`route ${route} has Arabic RTL content, no JS crash or horizontal overflow`,async({page},testInfo)=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 const backend:string[]=[];page.on('request',r=>{if(r.url().includes('/api/'))backend.push(r.url())});
 const response=await page.goto(route);expect(response?.status()).toBe(200);
 await expect(page.locator('html')).toHaveAttribute('lang','ar');await expect(page.locator('html')).toHaveAttribute('dir','rtl');
 await expect(page.locator('main')).toBeVisible();await expect(page.locator('h1')).not.toBeEmpty();
 await page.evaluate(()=>document.fonts.ready);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth <= innerWidth+1)).toBe(true);
 expect(errors).toEqual([]);expect(backend).toEqual([]);
 await page.screenshot({path:testInfo.outputPath(`${String(i+1).padStart(2,'0')}-page.png`),fullPage:true,animations:'disabled'});
});
test('display settings survive navigation and reload',async({page})=>{
 await page.goto('/settings');await page.getByRole('button',{name:'أزرق',exact:true}).click();
 await page.getByRole('slider',{name:'حجم الخط'}).fill('115');
 await page.getByRole('switch',{name:'الوضع الليلي',exact:true}).click();
 await page.goto('/');await expect(page.locator('html')).toHaveClass(/dark/);
 await page.goto('/settings');await page.reload();await expect(page.locator('html')).toHaveClass(/dark/);
 await expect(page.getByRole('slider',{name:'حجم الخط'})).toHaveValue('115');
 await expect(page.getByRole('button',{name:'أزرق',exact:true})).toHaveAttribute('aria-pressed','true');
});
test('local church favorite add, detail, reload and delete',async({page})=>{
 await page.goto('/churches');await page.getByRole('textbox',{name:'اسم الكنيسة',exact:true}).fill('كنيسة اختبار');
 await page.getByRole('textbox',{name:'المنطقة',exact:true}).fill('منطقة اختبار');
 await page.getByRole('button',{name:/إضافة/}).click();
 await page.getByText('كنيسة اختبار',{exact:true}).click();
 await expect(page).toHaveURL(/\/churches\//);await expect(page.getByText('كنيسة اختبار',{exact:true})).toBeVisible();
 await page.reload();await expect(page.getByText('كنيسة اختبار',{exact:true})).toBeVisible();
 await page.getByRole('button',{name:'شيل من المفضلة'}).click();
 await expect(page).toHaveURL(/\/churches$/);await expect(page.getByText('كنيسة اختبار',{exact:true})).toHaveCount(0);
});
test('corrupt local data does not crash church favorites',async({page})=>{
 await page.addInitScript(()=>localStorage.setItem('favChurches','{"invalid":true}'));await page.goto('/churches');
 await expect(page.getByRole('textbox',{name:'اسم الكنيسة',exact:true})).toBeVisible();
});
test('unknown reading identifier returns not found',async({page})=>{
 const response=await page.goto('/readings/does-not-exist');expect(response?.status()).toBe(404);
});
test('memory game cards reveal',async({page})=>{
 await page.goto('/games/memory');const cards=page.getByRole('button',{name:'كارت مقفول',exact:true});await expect(cards).toHaveCount(16);
 await cards.first().click();await expect(page.getByRole('button',{name:/صورة /})).toHaveCount(1);
});
for(const [i,route] of routes.entries())test(`dark blue large-font visual ${route}`,async({page},testInfo)=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>{localStorage.setItem('theme','dark');localStorage.setItem('fontScale','130')});
 await page.goto('/settings');await page.getByRole('button',{name:'أزرق',exact:true}).click();
 await page.goto(route);await expect(page.locator('html')).toHaveClass(/dark/);
 await page.evaluate(()=>document.fonts.ready);expect(await page.evaluate(()=>document.documentElement.scrollWidth <= innerWidth+1)).toBe(true);expect(errors).toEqual([]);
 await page.screenshot({path:testInfo.outputPath(`${String(i+1).padStart(2,'0')}-dark-large.png`),fullPage:true,animations:'disabled'});
});
test('legacy section links redirect without becoming dead routes',async({page})=>{
 for(const [old,target] of Object.entries({bible:'readings',katameros:'readings',hymns:'audio',library:'books'})){
  await page.goto('/'+old);await expect(page).toHaveURL(new RegExp('/'+target+'$'));await expect(page.locator('main')).toBeVisible();
 }
});
test('account bottom content and settings remain reachable above fixed navigation',async({page},testInfo)=>{
 await page.addInitScript(()=>{localStorage.setItem('theme','dark');localStorage.setItem('fontScale','130')});
 await page.goto('/account');await page.evaluate(()=>window.scrollTo(0,document.body.scrollHeight));
 const about=page.getByText('عن التطبيق',{exact:true});await expect(about).toBeVisible();
 const row=await about.boundingBox();const nav=await page.locator('nav').boundingBox();expect(row).not.toBeNull();expect(nav).not.toBeNull();expect(row!.y+row!.height).toBeLessThan(nav!.y);
 await about.click();await expect(page.getByText(/نسخة تجريبية:/)).toBeVisible();
 await page.evaluate(()=>window.scrollTo(0,document.body.scrollHeight));
 await page.screenshot({path:testInfo.outputPath('account-bottom-viewport.png'),animations:'disabled'});
 await page.getByRole('link',{name:/لون الثيم وحجم الخط والتنبيهات/}).click();await expect(page).toHaveURL(/\/settings$/);
});
