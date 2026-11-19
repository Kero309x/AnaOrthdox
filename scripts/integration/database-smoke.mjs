import {createRequire} from 'node:module';
import {randomUUID} from 'node:crypto';
import {spawn} from 'node:child_process';
import {setTimeout as delay} from 'node:timers/promises';
import assert from 'node:assert/strict';
const require=createRequire(new URL('../../apps/api/package.json',import.meta.url));
const {Pool}=require('pg');
const database=new URL(process.env.DATABASE_URL??'postgresql://invalid/invalid');
if(process.env.ALLOW_TEST_DATABASE!=='true'||!['localhost','127.0.0.1','postgres'].includes(database.hostname)||!database.pathname.endsWith('_test'))throw new Error('Use an explicitly allowed local/CI database with a name ending in _test');
const pool=new Pool({connectionString:database.toString()});
const port='3101';const base=`http://127.0.0.1:${port}/api/v1`;
const server=spawn(process.execPath,['dist/main.js'],{cwd:new URL('../../apps/api/',import.meta.url),env:{...process.env,NODE_ENV:'test',API_PORT:port,CORS_ORIGINS:'http://localhost:3000'},stdio:'inherit'});
const email=`foundation-${randomUUID()}@example.test`;let userId;
async function request(path,body,headers={}){return fetch(base+path,{method:body?'POST':'GET',headers:{'content-type':'application/json',...headers},body:body?JSON.stringify(body):undefined})}
try{
 let ready=false;for(let i=0;i<30;i++){try{if((await request('/health')).ok){ready=true;break}}catch{}await delay(500)}assert.ok(ready,'API did not become ready');
 const password='Temporary-Test-Only-937!a';
 const registered=await request('/auth/register',{email,password,fullName:'Foundation Test'});assert.equal(registered.status,201);
 const envelope=await registered.json();const created=envelope.data??envelope;userId=created.user.id;assert.ok(userId);assert.ok(created.accessToken);
 const me=await request('/auth/me',undefined,{authorization:`Bearer ${created.accessToken}`});assert.equal(me.status,200);
 const login=await request('/auth/login',{email,password});assert.equal(login.status,200);
 const cookie=login.headers.get('set-cookie')?.split(';')[0];assert.ok(cookie);
 const refreshed=await request('/auth/refresh',{}, {cookie});assert.equal(refreshed.status,200);
 const refreshCookie=refreshed.headers.get('set-cookie')?.split(';')[0];assert.ok(refreshCookie);
 const logout=await request('/auth/logout',{}, {cookie:refreshCookie});assert.equal(logout.status,200);
 const revoked=await request('/auth/refresh',{}, {cookie:refreshCookie});assert.equal(revoked.status,401);
 console.log('Real PostgreSQL auth smoke passed: register, me, login, refresh, logout, revoked refresh.');
}finally{
 await pool.query('DELETE FROM users WHERE email=$1',[email]);
 await pool.end();server.kill('SIGTERM');
}
