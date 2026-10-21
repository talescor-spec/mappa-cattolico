import React,{createContext,useCallback,useContext,useEffect,useRef,useState}from'react';
import{useAuth}from'./AuthContext';
import{safeGet,safeGetJSON,safeSet,safeSetJSON}from'../utils/storage';
import{mergeEntries,normalizeEntries}from'../utils/study';
import{supabase}from'../lib/supabase';
const StudyContext=createContext(null);
export function StudyProvider({children}){
 const{user,loading}=useAuth();const owner=user?.id||'guest';
 const [snapshot,setSnapshot]=useState({owner:'guest',data:normalizeEntries(safeGetJSON('fideoraStudy:guest'))});
 const [status,setStatus]=useState('local');const [consent,setConsent]=useState(false);const [storageError,setStorageError]=useState(false);
 const ref=useRef(snapshot);const syncVersion=useRef(0);const running=useRef(false);const latestOwner=useRef(owner);latestOwner.current=owner;
 useEffect(()=>{
  const data=normalizeEntries(safeGetJSON(`fideoraStudy:${owner}`));
  ref.current={owner,data};setSnapshot(ref.current);setConsent(safeGet(`fideoraStudyConsent:${owner}`)==='1');setStatus('local');syncVersion.current++;
 },[owner]);
 const write=useCallback((id,kind,payload,deleted=false)=>{
  if(loading||ref.current.owner!==latestOwner.current)return;
  const previous=ref.current.data[id];
  const stamp=Math.max(Date.now(),Date.parse(previous?.updatedAt||'1970-01-01')+1);
  const data={...ref.current.data,[id]:{id,kind,payload,deleted,updatedAt:new Date(stamp).toISOString()}};
  const ok=safeSetJSON(`fideoraStudy:${ref.current.owner}`,data);
  setStorageError(!ok);ref.current={owner:ref.current.owner,data};setSnapshot(ref.current);
 },[loading]);
 const sync=useCallback(async()=>{
  if(!user||!consent||running.current||loading)return;
  running.current=true;const token=syncVersion.current;const id=user.id;setStatus('syncing');
  try{
   const {data,error}=await supabase.from('fideora_study_entries').select('entry_id,kind,payload,deleted,client_updated_at').eq('user_id',id).limit(5000);
   if(error)throw error;if(token!==syncVersion.current||latestOwner.current!==id)return;
   const remote=Object.fromEntries(data.map(row=>[row.entry_id,{id:row.entry_id,kind:row.kind,payload:row.payload,deleted:row.deleted,updatedAt:row.client_updated_at}]));
   const merged=mergeEntries(ref.current.data,remote);
   const changed=Object.values(merged).filter(entry=>!remote[entry.id]||Date.parse(entry.updatedAt)>Date.parse(remote[entry.id].updatedAt));
   for(let offset=0;offset<changed.length;offset+=100){
    if(token!==syncVersion.current)return;
    const rows=changed.slice(offset,offset+100).map(entry=>({user_id:id,entry_id:entry.id,kind:entry.kind,payload:entry.payload,deleted:entry.deleted,client_updated_at:entry.updatedAt}));
    const result=await supabase.from('fideora_study_entries').upsert(rows,{onConflict:'user_id,entry_id'});if(result.error)throw result.error;
   }
   if(token!==syncVersion.current||latestOwner.current!==id)return;
   // Include edits made while the request was in flight.
   const final=mergeEntries(ref.current.data,merged);
   const ok=safeSetJSON(`fideoraStudy:${id}`,final);setStorageError(!ok);
   if(JSON.stringify(final)!==JSON.stringify(ref.current.data)){ref.current={owner:id,data:final};setSnapshot(ref.current);}setStatus('synced');
  }catch{if(token===syncVersion.current)setStatus('error');}
  finally{running.current=false;}
 },[user,consent,loading]);
 useEffect(()=>{
  const timer=window.setTimeout(sync,900);
  const online=()=>sync();window.addEventListener('online',online);
  return()=>{clearTimeout(timer);window.removeEventListener('online',online);};
 },[sync,snapshot]);
 const setCloudConsent=value=>{syncVersion.current++;setConsent(value);safeSet(`fideoraStudyConsent:${owner}`,value?'1':'0');if(!value)setStatus('local');};
 const entries=snapshot.owner===owner?Object.values(snapshot.data).filter(e=>!e.deleted):[];
 return <StudyContext.Provider value={{entries,write,remove:entry=>write(entry.id,entry.kind,{},true),status,consent,setCloudConsent,sync,storageError,ready:!loading&&snapshot.owner===owner}}>{children}</StudyContext.Provider>;
}
export const useStudy=()=>useContext(StudyContext);
