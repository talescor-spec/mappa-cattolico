import React,{useEffect,useRef}from'react';
import{X,ChevronRight}from'lucide-react';
import{useLanguage}from'../contexts/LanguageContext';
export function Mark(){return <svg width="34" height="34" viewBox="0 0 40 40" fill="none" aria-hidden="true"><rect width="40" height="40" rx="12" fill="currentColor"/><path d="M11 12c4-1 7 0 9 2 2-2 5-3 9-2v16c-4-1-7 0-9 2-2-2-5-3-9-2V12Z" stroke="#f7f5ec" strokeWidth="1.5"/><path d="M20 14v16M25 16v7m-2-4h4" stroke="#f7f5ec" strokeWidth="1.3"/></svg>;}
export function Header({eyebrow,title,subtitle,action}){return <div className="page-heading"><div>{eyebrow&&<p className="eyebrow">{eyebrow}</p>}<h1>{title}</h1>{subtitle&&<p>{subtitle}</p>}</div>{action}</div>;}
export function Row({icon:Icon,title,subtitle,onClick,end}){return <button className="list-row" onClick={onClick}><span className="row-icon">{Icon&&<Icon size={20}/>}</span><span className="row-copy"><strong>{title}</strong>{subtitle&&<small>{subtitle}</small>}</span>{end||<ChevronRight size={18}/>}</button>;}
export function Empty({icon:Icon,title,text,action}){return <div className="empty"><Icon size={28}/><h3>{title}</h3><p>{text}</p>{action}</div>;}
export function Modal({title,children,onClose,wide=false}){
 const ref=useRef(null);const {l}=useLanguage();
 useEffect(()=>{const previous=document.activeElement;ref.current.showModal();return()=>{ref.current?.close();previous?.focus?.();};},[]);
 return <dialog ref={ref} className={`modal ${wide?'wide':''}`} onCancel={e=>{e.preventDefault();onClose();}} onClick={e=>{if(e.target===ref.current)onClose();}}><div className="modal-inner"><header className="modal-head"><h2>{title}</h2><button className="icon-button" aria-label={l('Chiudi','Fechar')} onClick={onClose}><X size={20}/></button></header>{children}</div></dialog>;
}
