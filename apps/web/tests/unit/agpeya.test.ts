import {test} from 'node:test';
import assert from 'node:assert/strict';
import {normalizeHour,AgpeyaShapeError} from '../../src/domain/agpeya/normalize';
import {AGPEYA_HOURS,hourBySlug} from '../../src/domain/agpeya/hours';

// Synthetic strings only: no real prayer text is stored in tests.
const prose=(id:string)=>({id,kind:'conclusion',title:'T',content:['a',{text:'r',isResponse:true,coptic:'c'}]});
const psalm={id:'p1',kind:'psalm',title:'P',reference:'P',verses:[{num:1,text:'x'},{num:2,text:'y'}]};
test('hour slugs map to the seven upstream hours, unique',()=>{
 assert.equal(AGPEYA_HOURS.length,7);assert.equal(new Set(AGPEYA_HOURS.map(h=>h.id)).size,7);assert.equal(new Set(AGPEYA_HOURS.map(h=>h.upstream)).size,7);
 assert.equal(hourBySlug('baaker')?.upstream,'prime');assert.equal(hourBySlug('nope'),undefined);
});
test('normalize keeps order, repeated ids and verse numbers',()=>{
 const h=normalizeHour({id:'prime',name:'n',sections:[prose('lords-prayer'),psalm,prose('lords-prayer')]},'prime');
 assert.deepEqual(h.items.map(i=>i.id),['lords-prayer','p1','lords-prayer']);
 assert.equal(h.items[1].type,'verses');
});
test('midnight watches keep their nested sections and intro',()=>{
 const h=normalizeHour({id:'midnight',name:'n',sections:[{id:'midnight-1',kind:'watch',title:'W1',prayer:'pp',sections:[psalm]},{id:'midnight-2',kind:'watch',title:'W2',sections:[psalm]}]},'midnight');
 const w=h.items[0];assert.equal(w.type,'watch');if(w.type==='watch'){assert.equal(w.blocks.length,2);}
 assert.equal(h.items.length,2);
});
for(const [name,bad] of [['wrong id',{id:'terce',name:'n',sections:[prose('a')]}],['no sections',{id:'prime',name:'n',sections:[]}],['empty text',{id:'prime',name:'n',sections:[{id:'a',kind:'k',title:'t'}]}],['bad verse',{id:'prime',name:'n',sections:[{id:'a',kind:'psalm',verses:[{num:'1',text:'x'}]}]}],['not object',null]] as const)
 test(`rejects malformed upstream: ${name}`,()=>assert.throws(()=>normalizeHour(bad,'prime'),AgpeyaShapeError));
test('response lines are flagged and plain strings pass through',()=>{
 const h=normalizeHour({id:'prime',name:'n',sections:[prose('a')]},'prime');const b=h.items[0];
 assert.ok(b.type==='prose');if(b.type==='prose'){assert.deepEqual(b.lines,[{text:'a'},{text:'r',response:true}]);}
});
import {gapsFor} from '../../src/domain/agpeya/gaps';
test('bundled default reports no known gaps, the coptic-api mode still describes them',()=>{
 for(const h of AGPEYA_HOURS) assert.deepEqual(gapsFor(h.id),[],h.id);
 assert.deepEqual(gapsFor('bogus'),[]);
});
import dataset from '../../src/data/agpeya/agpeya.json';
test('bundled dataset: 7 hours + veil, midnight has 3 watches, no empty blocks, one 41x counter per hour (one per watch at midnight)',()=>{
 const d=dataset as Record<string,any>;
 assert.deepEqual(Object.keys(d).sort(),['compline','midnight','none','prime','sext','terce','veil','vespers']);
 assert.equal(d.midnight.items.length,3);
 for(const [id,h] of Object.entries<any>(d)){
  const blocks=h.items.flatMap((i:any)=>i.type==='watch'?i.blocks:[i]);
  assert.ok(blocks.length>10,id);
  assert.equal(blocks.filter((b:any)=>b.repeat===41).length,id==='midnight'?3:1,id);
  for(const b of blocks) if(b.repeat===undefined) assert.ok(b.lines.length>0&&b.lines.every((l:any)=>l.text.trim()),b.id);
 }
});
test('bundled dataset: refrains are written out and the confirmed typo is fixed',()=>{
 const all=JSON.stringify(dataset);
 assert.ok(!all.includes('لتسقم'));assert.ok(all.includes('لتستقم'));
 assert.ok(!all.includes('كينين'));
 assert.ok((all.match(/المجد لك يا محب البشر/g)||[]).length>=19);
 assert.ok((all.match(/ابنيفماتي/g)||[]).length>=14);
});
test('bundled dataset: no abbreviation marks after any refrain cue',()=>{
 const d=dataset as Record<string,any>;let left=0;
 for(const [id,h] of Object.entries<any>(d)) for(const i of h.items) for(const b of (i.type==='watch'?i.blocks:[i])) for(const l of b.lines||[])
  for(const m of l.text.matchAll(/(ذوكصا|ذكصا|كى نين|كي نين)\S*\s?(…|\.\.)/g)) {left++;}
 assert.equal(left,0);
 assert.ok(!JSON.stringify(dataset).includes('آمين. الصلاة الربانية'));
});
test('midnight watch 3 order: concluding gospel, Trisagion, hail, creed intro, creed (Seattle Arabic order)',()=>{
 const ids=(dataset as any).midnight.items[2].blocks.map((b:any)=>b.id.replace(/^midnight-3-(\d+-)?/,''));
 const i=ids.indexOf('midnight_gospel');
 assert.deepEqual(ids.slice(i,i+5),['midnight_gospel','holy_god','hail_you','creed_strart','faith_creed']);
 assert.equal(ids.filter((x:string)=>x==='holy3').length,2);
});
test('no abbreviated Lord\'s Prayer cue is left: every cue is followed by the full prayer text',()=>{
 for(const h of Object.values<any>(dataset)) for(const it of h.items) for(const b of (it.type==='watch'?it.blocks:[it])) for(const l of b.lines||[]) assert.ok(!/السموات\s*(\.\.\.|…)/.test(l.text),b.id);
 const blocks=(dataset as any).midnight.items[2].blocks; const g=blocks.find((b:any)=>b.id.endsWith('holy_god'));
 assert.ok(g.lines[g.lines.length-1].text.includes('لكن نجنا من الشرير'));
 assert.equal(blocks.find((b:any)=>b.id.endsWith('midnight_gospel')).title,'إنجيل الختام');
});
