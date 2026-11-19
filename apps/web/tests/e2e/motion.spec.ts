import {test,expect} from '@playwright/test';
test('expressive slider anatomy pointer keyboard RTL and persistence',async({page},testInfo)=>{
 await page.goto('/settings');const slider=page.getByRole('slider',{name:'حجم الخط'});await expect(page.locator('m3e-slider')).toBeVisible();await slider.focus();await page.keyboard.press('Home');await expect(slider).toHaveAttribute('aria-valuenow','85');await page.keyboard.press('ArrowLeft');await expect(slider).toHaveAttribute('aria-valuenow','90');await page.keyboard.press('End');await expect(slider).toHaveAttribute('aria-valuenow','130');await page.keyboard.press('ArrowRight');await expect(slider).toHaveAttribute('aria-valuenow','125');
 await page.locator('m3e-slider').scrollIntoViewIfNeeded();await page.evaluate(()=>window.scrollBy(0,160));const box=await page.locator('m3e-slider').boundingBox();expect(box).not.toBeNull();await page.mouse.click(box!.x+box!.width*.5,box!.y+box!.height*.5);const value=Number(await slider.getAttribute('aria-valuenow'));expect(value).toBeGreaterThanOrEqual(100);expect(value).toBeLessThanOrEqual(115);await page.reload();await expect(slider).toHaveAttribute('aria-valuenow',String(value));await page.screenshot({path:testInfo.outputPath('expressive-slider-light.png'),fullPage:true});
 await page.getByRole('switch',{name:'الوضع الليلي',exact:true}).click();await page.getByRole('button',{name:'أزرق',exact:true}).click();await page.screenshot({path:testInfo.outputPath('expressive-slider-dark-blue.png'),fullPage:true});
});
test('client navigation preserves dark theme, fixed nav and reduced motion',async({page},testInfo)=>{
 await page.addInitScript(()=>localStorage.setItem('theme','dark'));await page.goto('/settings');await expect(page.locator('html')).toHaveClass(/dark/);await page.evaluate(()=>{(window as unknown as {themeFlashes:number}).themeFlashes=0;new MutationObserver(()=>{if(!document.documentElement.classList.contains('dark'))(window as unknown as {themeFlashes:number}).themeFlashes++}).observe(document.documentElement,{attributes:true,attributeFilter:['class']})});
 await page.getByRole('link',{name:'حسابي',exact:true}).click();await expect(page).toHaveURL(/\/account$/);await expect(page.getByRole('link',{name:'حسابي',exact:true})).toHaveAttribute('aria-current','page');await expect.poll(()=>page.evaluate(()=>document.getAnimations().length)).toBeGreaterThan(0);await expect.poll(()=>page.evaluate(()=>document.getAnimations().filter(a=>a.playState==='running').length)).toBe(0);expect(await page.evaluate(()=>(window as unknown as {themeFlashes:number}).themeFlashes)).toBe(0);expect(await page.locator('nav').evaluate(el=>getComputedStyle(el).transform)).toBe('none');await page.screenshot({path:testInfo.outputPath('account-arrived-dark.png'),fullPage:true});
 await page.goBack();await expect(page).toHaveURL(/\/settings$/);await expect(page.locator('html')).toHaveClass(/dark/);await page.emulateMedia({reducedMotion:'reduce'});await page.getByRole('link',{name:'الرئيسية',exact:true}).click();await expect(page).toHaveURL(/\/$/);await expect.poll(()=>page.evaluate(()=>document.getAnimations().filter(a=>a.playState==='running').length)).toBe(0);
});

test('settings controls and bottom content can scroll clear of fixed navigation',async({page,context},testInfo)=>{
 await context.grantPermissions(['notifications']);
 await page.addInitScript(()=>{localStorage.setItem('theme','dark');localStorage.setItem('fontScale','130')});await page.goto('/settings');const notify=page.getByRole('switch',{name:'تذكير يومي',exact:true});await notify.scrollIntoViewIfNeeded();await page.evaluate(()=>window.scrollBy(0,160));const control=await notify.boundingBox();const nav=await page.locator('nav').boundingBox();expect(control!.y+control!.height).toBeLessThan(nav!.y);await notify.click();await expect(notify).toHaveAttribute('aria-checked','true');await page.evaluate(()=>window.scrollTo(0,document.body.scrollHeight));const about=page.getByText('أنا أرثوذكسي',{exact:true}).last();const area=await about.boundingBox();expect(area!.y+area!.height).toBeLessThan(nav!.y);await expect(page.locator('[aria-live=polite] span')).toHaveCount(0);await page.screenshot({path:testInfo.outputPath('settings-bottom-scroll-viewport.png')});
});


test('font sample scales once with the app at both slider limits',async({page})=>{
 await page.goto('/settings');const slider=page.getByRole('slider',{name:'حجم الخط'});await slider.focus();
 for(const key of ['Home','End']){await page.keyboard.press(key);const value=Number(await slider.getAttribute('aria-valuenow'));const sizes=await page.getByTestId('font-scale-preview').evaluate(el=>({sample:parseFloat(getComputedStyle(el).fontSize),root:parseFloat(getComputedStyle(document.documentElement).fontSize)}));expect(sizes.sample).toBeCloseTo(sizes.root,1);expect(sizes.root).toBeCloseTo(16*value/100,1);}
});


test('settings switch thumb stays inside its track at maximum font',async({page},testInfo)=>{
 await page.addInitScript(()=>{localStorage.setItem('fontScale','130');localStorage.setItem('theme','dark')});await page.goto('/settings');const control=page.getByRole('switch',{name:'الوضع الليلي',exact:true});
 for(const state of [true,false,true]){if((await control.getAttribute('aria-checked'))!==String(state))await control.click();const boxes=await control.evaluate(el=>{const track=el.firstElementChild!,thumb=track.firstElementChild!;const a=track.getBoundingClientRect(),b=thumb.getBoundingClientRect();return {left:a.left,right:a.right,thumbLeft:b.left,thumbRight:b.right}});expect(boxes.thumbLeft).toBeGreaterThanOrEqual(boxes.left-.5);expect(boxes.thumbRight).toBeLessThanOrEqual(boxes.right+.5);}
 await page.screenshot({path:testInfo.outputPath('settings-switch-130.png')});
});
