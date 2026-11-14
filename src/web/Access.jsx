import React, { useState } from 'react';
import { Fideora } from '../App';
import { usePremium } from '../contexts/PremiumContext';
import Onboarding from '../components/Onboarding';
import WebGate, { InstallApp } from './WebGate';
import { safeGet, safeSet } from '../utils/storage';
export default function WebAccess() {
  const { isPremium, checking } = usePremium();
  const [onboard, setOnboard] = useState(() => safeGet('fideoraWebOnboarded') !== '1');
  // Checkout comes first. Returning buyers authenticate before optional introduction.
  if (!isPremium || checking) return <WebGate/>;
  if (onboard) return <Onboarding hasPremium onFinish={() => {
    safeSet('fideoraWebOnboarded', '1'); safeSet('fideoraOnboarded', '1'); setOnboard(false);
  }}/>;
  return <><Fideora/><aside className="web-installed-access"><InstallApp/></aside></>;
}
