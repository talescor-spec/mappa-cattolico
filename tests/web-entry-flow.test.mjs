import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import React from 'react';
import { create, act } from 'react-test-renderer';
import { build } from 'vite';

test('post-checkout access authenticates first, never asks active buyers to subscribe again, and locks on expiry', async () => {
  const root = process.cwd(), temp = mkdtempSync(path.join(root, '.web-flow-test-'));
  try {
    const mocks = path.join(temp, 'mocks.jsx'), entry = path.join(temp, 'entry.mjs');
    writeFileSync(mocks, `import React from 'react';
      export const state={premium:{isPremium:false,checking:false},storage:new Map()};
      export const usePremium=()=>state.premium;
      export const safeGet=key=>state.storage.get(key);
      export const safeSet=(key,value)=>state.storage.set(key,value);
      export const Fideora=()=> <main data-view="content"/>;
      export const InstallApp=()=>null;
      export default function Mock(props){return <main data-view={props.hasPremium?'introduction':'login'}/>;}`);
    writeFileSync(entry, `export {default as WebAccess} from ${JSON.stringify(path.join(root,'src/web/Access.jsx'))}; export {state,default as Mock} from ${JSON.stringify(mocks)};`);
    const result = await build({configFile:false,logLevel:'silent',resolve:{alias:[{
      find:/^(\.\.\/App|\.\.\/contexts\/PremiumContext|\.\.\/components\/Onboarding|\.\/WebGate|\.\.\/utils\/storage)$/,
      replacement:mocks,
    }]},build:{write:false,minify:false,lib:{entry,formats:['es']},rollupOptions:{external:[/^react(?:\/.*)?$/],output:{inlineDynamicImports:true}}}});
    const bundle=path.join(temp,'bundle.mjs');
    writeFileSync(bundle,(Array.isArray(result)?result[0]:result).output.find(x=>x.type==='chunk').code);
    const {WebAccess,state,Mock}=await import(pathToFileURL(bundle));
    let tree;
    const render=()=>act(async()=>{if(tree)tree.update(React.createElement(WebAccess));else tree=create(React.createElement(WebAccess));});
    const view=()=>tree.root.findByType('main').props['data-view'];
    try {
      await render(); assert.equal(view(),'login');
      state.premium={isPremium:true,checking:true}; await render(); assert.equal(view(),'login');
      state.premium={isPremium:true,checking:false}; await render(); assert.equal(view(),'introduction');
      assert.equal(tree.root.findByType(Mock).props.hasPremium,true);
      await act(async()=>tree.root.findByType(Mock).props.onFinish()); assert.equal(view(),'content');
      state.premium={isPremium:false,checking:false}; await render(); assert.equal(view(),'login');
      state.premium={isPremium:true,checking:false}; await render(); assert.equal(view(),'content');
    } finally {if(tree)await act(async()=>tree.unmount());}
  } finally {rmSync(temp,{recursive:true,force:true});}
});
