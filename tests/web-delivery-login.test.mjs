import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import React from 'react';
import { create, act } from 'react-test-renderer';
import { build } from 'vite';

test('the legacy Hotmart delivery URL uses buyer email codes; reviewer passwords require an explicit choice', async () => {
  const root=process.cwd(), temp=mkdtempSync(path.join(root,'.delivery-login-test-'));
  const oldWindow=globalThis.window;
  let tree;
  try {
    const mock=path.join(temp,'mock.jsx'), entry=path.join(temp,'entry.mjs');
    writeFileSync(mock,`import React from 'react';
      export const state={calls:[]};
      export const useAuth=()=>({user:null,loading:false,sendMagicLink:async data=>state.calls.push({method:'code',email:data.email}),verifyEmailCode:async()=>{}});
      export const usePremium=()=>({refresh:async()=>false,checking:false,webError:false});
      export const useLanguage=()=>({l:(it,pt)=>it,language:'it',changeLanguage(){}});
      export const Mark=()=> <span>Fideora</span>;
      export const Modal=({children})=> <div>{children}</div>;
      export const webRequest=async()=>({plans:[]});
      export const validCheckout=()=>false;
      export const supabase={auth:{signInWithPassword:async data=>{state.calls.push({method:'password',email:data.email});return {error:null};}}};
      export default function Profile(){return null;}`);
    writeFileSync(entry,`export {default as WebGate} from ${JSON.stringify(path.join(root,'src/web/WebGate.jsx'))};export {state} from ${JSON.stringify(mock)};`);
    const result=await build({configFile:false,logLevel:'silent',resolve:{alias:[{find:/^(\.\.\/contexts\/(AuthContext|PremiumContext|LanguageContext)|\.\.\/components\/(UI|Profile)|\.\/api|\.\.\/lib\/supabase)$/,replacement:mock}]},build:{write:false,minify:false,lib:{entry,formats:['es']},rollupOptions:{external:[/^react(?:\/.*)?$/],output:{inlineDynamicImports:true}}}});
    const bundle=path.join(temp,'bundle.mjs');writeFileSync(bundle,(Array.isArray(result)?result[0]:result).output.find(x=>x.type==='chunk').code);
    const {WebGate,state}=await import(pathToFileURL(bundle));
    globalThis.window=Object.assign(new EventTarget(),{location:{search:'?review=hotmart'},matchMedia:()=>({matches:false})});
    await act(async()=>{tree=create(React.createElement(WebGate));});
    assert.equal(tree.root.findAll(node=>node.type==='input'&&node.props.type==='password').length,0);
    const text=node=>node.children.map(x=>typeof x==='string'?x:text(x)).join('');
    const button=label=>tree.root.findAllByType('button').find(b=>text(b)===label);
    assert.ok(button('Ricevi il codice di accesso'));
    await act(async()=>tree.root.findByProps({id:'web-email'}).props.onChange({target:{value:'buyer@example.com'}}));
    await act(async()=>tree.root.findByType('form').props.onSubmit({preventDefault(){}}));
    assert.deepEqual(state.calls,[{method:'code',email:'buyer@example.com'}]);
    await act(async()=>button('Accesso con password').props.onClick());
    assert.equal(tree.root.findAll(node=>node.type==='input'&&node.props.type==='password').length,1);
    await act(async()=>tree.root.findByProps({id:'web-review-password'}).props.onChange({target:{value:'fixture-password'}}));
    await act(async()=>tree.root.findByType('form').props.onSubmit({preventDefault(){}}));
    assert.deepEqual(state.calls.at(-1),{method:'password',email:'buyer@example.com'});
    await act(async()=>button('Usa il codice via email').props.onClick());
    assert.equal(tree.root.findAll(node=>node.type==='input'&&node.props.type==='password').length,0);
  } finally {
    if(tree)await act(async()=>tree.unmount());
    globalThis.window=oldWindow;rmSync(temp,{recursive:true,force:true});
  }
});
