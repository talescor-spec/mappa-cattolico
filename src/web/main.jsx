import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { Fideora } from '../App';
import { AuthProvider } from '../contexts/AuthContext';
import { LanguageProvider } from '../contexts/LanguageContext';
import { StudyProvider } from '../contexts/StudyContext';
import { usePremium } from '../contexts/PremiumContext';
import Onboarding from '../components/Onboarding';
import WebPremiumProvider from './PremiumProvider';
import WebGate, { InstallApp } from './WebGate';
import { safeGet, safeSet } from '../utils/storage';
import './web.css';
function WebAccess() {
  const { isPremium, checking } = usePremium();
  const [onboard, setOnboard] = useState(safeGet('fideoraWebOnboarded') !== '1');
  if (onboard) return <Onboarding hardPaywall onFinish={() => {
    safeSet('fideoraWebOnboarded', '1'); safeSet('fideoraOnboarded', '1'); setOnboard(false);
  }}/>;
  if (!isPremium || checking) return <WebGate/>;
  return <><Fideora/><aside className="web-installed-access"><InstallApp/></aside></>;
}
ReactDOM.createRoot(document.getElementById('root')).render(<React.StrictMode><AuthProvider><LanguageProvider><WebPremiumProvider><StudyProvider><WebAccess/></StudyProvider></WebPremiumProvider></LanguageProvider></AuthProvider></React.StrictMode>);
if ('serviceWorker' in navigator && import.meta.env.PROD) window.addEventListener('load', () => { navigator.serviceWorker.register('/app/sw.js', { scope: '/app/' }).catch(() => {}); });
