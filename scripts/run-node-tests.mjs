import {readdirSync} from 'node:fs';
import {join} from 'node:path';
import {spawnSync} from 'node:child_process';
function find(dir){return readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?find(join(dir,e.name)):e.name.endsWith('.spec.js')?[join(dir,e.name)]:[])}
const files=find(process.argv[2]??'dist').sort();
if(!files.length)throw new Error('No compiled test files found. Build first.');
console.log(`Running ${files.length} compiled test files recursively.`);
const result=spawnSync(process.execPath,['--test',...files],{stdio:'inherit'});
process.exit(result.status??1);
