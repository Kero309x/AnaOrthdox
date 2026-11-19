import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createSafeStorage} from '../../src/shared/lib/storage';
import {parseChurchFavorites,readings} from '../../src/data/local';
import {READING_SLOTS,slotById} from '../../src/domain/readings/slots';
import {gregorianToCoptic,copticToJd,jdToGregorian,copticMonthLength} from '../../src/domain/calendar/coptic';

test('storage tolerates SSR/unavailable browser storage',()=>{
 const store=createSafeStorage(()=>null);assert.equal(store.getItem('x'),null);assert.equal(store.setItem('x','y'),false);assert.equal(store.removeItem('x'),false);
});
test('storage tolerates disabled storage without claiming saved',()=>{
 const store=createSafeStorage(()=>{throw new Error('denied')});assert.equal(store.getItem('x'),null);assert.equal(store.setItem('x','y'),false);
});
test('storage writes, reads and removes the original key',()=>{
 const data=new Map<string,string>();const store=createSafeStorage(()=>({getItem:k=>data.get(k)??null,setItem:(k,v)=>{data.set(k,v)},removeItem:k=>{data.delete(k)}}));
 assert.equal(store.setItem('favChurches','[]'),true);assert.equal(store.getItem('favChurches'),'[]');assert.equal(store.removeItem('favChurches'),true);assert.equal(store.getItem('favChurches'),null);
});
for(const raw of [null,'broken','{}','null','42','[null,1,"x"]']) test(`invalid favorite payload is safe: ${raw}`,()=>assert.deepEqual(parseChurchFavorites(raw),[]));
test('favorites validate field types, sizes and duplicate IDs',()=>{
 const good={id:'1',name:'كنيسة تجريبية',area:'منطقة تجريبية'};
 assert.deepEqual(parseChurchFavorites(JSON.stringify([good,good,{id:'2',name:9,area:''},{id:'3',name:'x'.repeat(61),area:''}])),[good]);
});
test('favorite HTML remains plain data and extra properties are dropped',()=>{
 assert.deepEqual(parseChurchFavorites('[{"id":"1","name":"<script>x</script>","area":"","admin":true}]'),[{id:'1',name:'<script>x</script>',area:''}]);
});
test('reading identifiers are unique and unknown identifiers reject',()=>{
 assert.equal(new Set(READING_SLOTS.map(s=>s.id)).size,READING_SLOTS.length);assert.equal(READING_SLOTS.length,7);assert.equal(slotById('not-a-slot'),undefined);assert.equal(slotById('gospel')?.name,'الإنجيل');
});
test('missing approved readings stay unavailable, no invented text',async()=>{
 const result=await readings.get('2026-11-19','gospel');assert.equal(result.status,'unavailable');assert.equal('data' in result,false);
});
test('calendar adapter agrees with shared engine across leap-year boundary',()=>{
 for(let year=2025;year<=2028;year++)for(let month=1;month<=12;month++){
  for(let day=1;day<=28;day++){
   const c=gregorianToCoptic(year,month,day);assert.deepEqual(jdToGregorian(copticToJd(c.year,c.month,c.day)),{y:year,m:month,d:day});
  }
 }
});
test('Nasie validates leap/common year and rejects invalid month',()=>{
 assert.equal(copticMonthLength(1743,13),6);assert.equal(copticMonthLength(1744,13),5);assert.throws(()=>copticMonthLength(1743,14));
});
