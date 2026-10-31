import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {displayAuthorized} from '../lib/display-auth';
test('Display fails closed and validates URL and API bearer access',()=>{
 const key='a'.repeat(64), hash=createHash('sha256').update(key).digest('hex');
 assert.equal(displayAuthorized(new Request('https://example.com/display'),hash),false);
 assert.equal(displayAuthorized(new Request('https://example.com/display?key='+key),hash),true);
 assert.equal(displayAuthorized(new Request('https://example.com/api/display',{headers:{authorization:'Bearer '+key}}),hash),true);
 assert.equal(displayAuthorized(new Request('https://example.com/display?key='+'b'.repeat(64)),hash),false);
 assert.equal(displayAuthorized(new Request('https://example.com/display?key='+key),''),false);
});
