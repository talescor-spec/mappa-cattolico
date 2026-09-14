import React, { useEffect, useMemo, useState } from 'react';
import { Book, Calendar, Check, ChevronRight, Edit2, Heart, Home, User, X } from 'lucide-react';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import LanguageSelector from './components/LanguageSelector';
import './styles.css';

const ROSARY_STEPS = 53;

function FideoraMark({ small = false }) {
  return <div className={`fideora-mark ${small ? 'small' : ''}`} aria-hidden="true"><span>✦</span></div>;
}

function getGreetingKey() {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 18) return 'afternoon';
  return 'evening';
}

function useVisitStreak() {
  const [streak, setStreak] = useState(1);
  useEffect(() => {
    const today = new Date();
    const todayKey = today.toISOString().slice(0, 10);
    const previousKey = localStorage.getItem('fideoraLastVisit');
    let value = Number(localStorage.getItem('fideoraStreak') || 0);
    if (!previousKey) value = 1;
    else if (previousKey !== todayKey) {
      const previous = new Date(`${previousKey}T12:00:00`);
      const diff = Math.round((new Date(`${todayKey}T12:00:00`) - previous) / 86400000);
      value = diff === 1 ? value + 1 : 1;
    }
    localStorage.setItem('fideoraLastVisit', todayKey);
    localStorage.setItem('fideoraStreak', String(value));
    setStreak(value || 1);
  }, []);
  return streak;
}

function FideoraApp() {
  const { t, getFormattedDate } = useLanguage();
  const [page, setPage] = useState('today');
  const [detail, setDetail] = useState(null);
  const [name, setName] = useState(() => localStorage.getItem('fideoraUserName') || '');
  const [editName, setEditName] = useState(false);
  const [draftName, setDraftName] = useState('');
  const [rosaryProgress, setRosaryProgress] = useState(() => JSON.parse(localStorage.getItem('rosaryProgress') || '{}'));
  const [novenaProgress, setNovenaProgress] = useState(() => JSON.parse(localStorage.getItem('novenaProgress') || '{}'));
  const streak = useVisitStreak();

  const todayKey = new Date().toDateString();
  const displayName = name || t('friend');

  const mysteries = useMemo(() => ([
    { id: 'joyful', title: t('joyful'), days: t('joyfulDays') },
    { id: 'luminous', title: t('luminous'), days: t('luminousDays') },
    { id: 'sorrowful', title: t('sorrowful'), days: t('sorrowfulDays') },
    { id: 'glorious', title: t('glorious'), days: t('gloriousDays') },
  ]), [t]);

  const prayers = useMemo(() => ([
    { id: 'ourFather', title: t('ourFather'), text: t('ourFatherText') },
    { id: 'hailMary', title: t('hailMary'), text: t('hailMaryText') },
    { id: 'gloryBe', title: t('gloryBe'), text: t('gloryBeText') },
    { id: 'hailQueen', title: t('hailQueen'), text: t('hailQueenText') },
  ]), [t]);

  const novenas = useMemo(() => [1, 2, 3, 4, 5].map((n) => ({
    id: `novena${n}`,
    title: t(`novena${n}`),
    purpose: t(`novena${n}Purpose`),
  })), [t]);

  const openDetail = (type, item = null) => setDetail({ type, item });
  const closeDetail = () => setDetail(null);

  const setRosaryStep = (mysteryId, step) => {
    const next = {
      ...rosaryProgress,
      [todayKey]: { ...(rosaryProgress[todayKey] || {}), [mysteryId]: step },
    };
    setRosaryProgress(next);
    localStorage.setItem('rosaryProgress', JSON.stringify(next));
  };

  const setNovenaDay = (novenaId, day) => {
    const next = { ...novenaProgress, [novenaId]: day };
    setNovenaProgress(next);
    localStorage.setItem('novenaProgress', JSON.stringify(next));
  };

  const saveName = () => {
    const next = draftName.trim();
    setName(next);
    localStorage.setItem('fideoraUserName', next);
    setEditName(false);
  };

  if (detail) {
    return (
      <AppShell page={page} setPage={setPage} hideNav>
        <DetailHeader onBack={closeDetail} />
        {detail.type === 'gospel' && <GospelDetail t={t} date={getFormattedDate()} />}
        {detail.type === 'rosary' && (
          <RosaryDetail
            t={t}
            mysteries={mysteries}
            progress={rosaryProgress[todayKey] || {}}
            onStep={setRosaryStep}
          />
        )}
        {detail.type === 'prayer' && <PrayerDetail prayer={detail.item} />}
        {detail.type === 'novena' && (
          <NovenaDetail
            t={t}
            novena={detail.item}
            day={novenaProgress[detail.item.id] || 0}
            onDay={(day) => setNovenaDay(detail.item.id, day)}
          />
        )}
      </AppShell>
    );
  }

  return (
    <AppShell page={page} setPage={setPage}>
      {page === 'today' && (
        <TodayPage
          t={t}
          date={getFormattedDate()}
          displayName={displayName}
          streak={streak}
          onGospel={() => openDetail('gospel')}
          onRosary={() => openDetail('rosary')}
          onPrayer={() => openDetail('prayer', prayers[1])}
          onNovena={() => openDetail('novena', novenas[0])}
        />
      )}
      {page === 'bible' && <BiblePage t={t} date={getFormattedDate()} onGospel={() => openDetail('gospel')} />}
      {page === 'pray' && <PrayPage t={t} prayers={prayers} onRosary={() => openDetail('rosary')} onPrayer={(p) => openDetail('prayer', p)} />}
      {page === 'paths' && <PathsPage t={t} novenas={novenas} progress={novenaProgress} onNovena={(n) => openDetail('novena', n)} />}
      {page === 'profile' && (
        <ProfilePage
          t={t}
          displayName={displayName}
          streak={streak}
          onEdit={() => { setDraftName(name); setEditName(true); }}
        />
      )}
      {editName && (
        <div className="sheet-backdrop" onMouseDown={() => setEditName(false)}>
          <div className="sheet" onMouseDown={(e) => e.stopPropagation()}>
            <button className="sheet-close" onClick={() => setEditName(false)}><X size={18} /></button>
            <p className="eyebrow">FIDEORA</p>
            <h2>{t('editName')}</h2>
            <label>{t('yourName')}</label>
            <input value={draftName} onChange={(e) => setDraftName(e.target.value)} autoFocus />
            <div className="sheet-actions">
              <button className="button secondary" onClick={() => setEditName(false)}>{t('cancel')}</button>
              <button className="button primary" onClick={saveName}>{t('save')}</button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}

function AppShell({ children, page, setPage, hideNav = false }) {
  const { t } = useLanguage();
  const tabs = [
    ['today', Home, t('navToday')],
    ['bible', Book, t('navBible')],
    ['pray', Heart, t('navPray')],
    ['paths', Calendar, t('navPaths')],
    ['profile', User, t('navProfile')],
  ];
  return (
    <div className="app-frame">
      <div className="app-shell">
        <header className="topbar">
          <div className="brand"><FideoraMark small /><div><strong>{t('appName')}</strong><span>{t('tagline')}</span></div></div>
          <LanguageSelector compact />
        </header>
        <main>{children}</main>
        {!hideNav && (
          <nav className="bottom-nav">
            {tabs.map(([id, Icon, label]) => (
              <button key={id} className={page === id ? 'active' : ''} onClick={() => setPage(id)}>
                <Icon size={20} strokeWidth={1.8} />
                <span>{label}</span>
              </button>
            ))}
          </nav>
        )}
      </div>
    </div>
  );
}

function TodayPage({ t, date, displayName, streak, onGospel, onRosary, onPrayer, onNovena }) {
  return (
    <div className="page page-today">
      <section className="hero-copy">
        <div>
          <p className="eyebrow">{date}</p>
          <h1>{t(getGreetingKey())}, {displayName}.</h1>
          <p>{t('dayIntro')}</p>
        </div>
        <div className="streak-pill"><span>✦</span><b>{streak}</b></div>
      </section>

      <button className="gospel-hero" onClick={onGospel}>
        <div className="gospel-art"><div className="cross-line" /></div>
        <div className="gospel-copy">
          <p className="eyebrow light">{t('gospelEyebrow')}</p>
          <h2>{t('gospelTitle')}</h2>
          <p>{t('gospelRef')}</p>
          <span>{t('readMeditate')} <ChevronRight size={16} /></span>
        </div>
      </button>

      <SectionHeader title={t('yourDay')} />
      <div className="stack-list">
        <ActionRow icon={<Heart size={20} />} title={t('rosary')} subtitle={`8 ${t('minutes')} · ${t('rosarySubtitle')}`} onClick={onRosary} />
        <ActionRow icon={<Book size={20} />} title={t('prayerOfDay')} subtitle={t('hailMary')} onClick={onPrayer} />
        <ActionRow icon={<Calendar size={20} />} title={t('novenas')} subtitle={t('novena1')} onClick={onNovena} />
      </div>
    </div>
  );
}

function BiblePage({ t, date, onGospel }) {
  return (
    <div className="page">
      <PageIntro eyebrow={date} title={t('gospel')} subtitle={t('dayIntro')} />
      <button className="editorial-card" onClick={onGospel}>
        <div className="editorial-number">20</div>
        <div><p className="eyebrow">{t('gospelRef')}</p><h2>{t('gospelTitle')}</h2><p>{t('gospelText')}</p><span>{t('readMeditate')} <ChevronRight size={16} /></span></div>
      </button>
      <div className="quiet-note"><FideoraMark small /><p>{t('gospelReflection')}</p></div>
    </div>
  );
}

function PrayPage({ t, prayers, onRosary, onPrayer }) {
  return (
    <div className="page">
      <PageIntro eyebrow="FIDEORA" title={t('prayTitle')} subtitle={t('praySubtitle')} />
      <button className="rosary-feature" onClick={onRosary}>
        <div className="rosary-beads">•••••<br/>• ✦ •<br/>•••••</div>
        <div><p className="eyebrow light">{t('rosary')}</p><h2>{t('rosarySubtitle')}</h2><span>{t('openRosary')} <ChevronRight size={16} /></span></div>
      </button>
      <SectionHeader title={t('prayers')} />
      <div className="stack-list">
        {prayers.map((p) => <ActionRow key={p.id} icon={<Heart size={19} />} title={p.title} subtitle={`${p.text.slice(0, 70)}…`} onClick={() => onPrayer(p)} />)}
      </div>
    </div>
  );
}

function PathsPage({ t, novenas, progress, onNovena }) {
  return (
    <div className="page">
      <PageIntro eyebrow="FIDEORA" title={t('pathsTitle')} subtitle={t('pathsSubtitle')} />
      <div className="novena-grid">
        {novenas.map((n, index) => {
          const day = progress[n.id] || 0;
          return (
            <button key={n.id} className="novena-card" onClick={() => onNovena(n)}>
              <div className="novena-top"><span>0{index + 1}</span><small>{day}/9</small></div>
              <h3>{n.title}</h3><p>{n.purpose}</p>
              <div className="mini-progress"><i style={{ width: `${(day / 9) * 100}%` }} /></div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ProfilePage({ t, displayName, streak, onEdit }) {
  return (
    <div className="page">
      <PageIntro eyebrow="FIDEORA" title={t('profileTitle')} subtitle={t('profileSubtitle')} />
      <section className="profile-card">
        <div className="profile-avatar"><FideoraMark /></div>
        <div><h2>{displayName}</h2><p>{t('tagline')}</p></div>
        <button onClick={onEdit}><Edit2 size={17} /></button>
      </section>
      <div className="stats-grid">
        <div><b>{streak}</b><span>{t('streak')}</span></div>
        <div><b>✓</b><span>{t('localProgress')}</span></div>
      </div>
      <section className="settings-card">
        <div><span>{t('language')}</span><LanguageSelector /></div>
        <div><span>{t('version')}</span></div>
      </section>
    </div>
  );
}

function DetailHeader({ onBack }) {
  const { t } = useLanguage();
  return <div className="detail-header"><button onClick={onBack}>←</button><span>{t('back')}</span></div>;
}

function GospelDetail({ t, date }) {
  return (
    <article className="page reading-page">
      <p className="eyebrow">{date}</p>
      <h1>{t('gospelTitle')}</h1>
      <p className="reading-reference">{t('gospelRef')}</p>
      <div className="reading-dropcap"><p>{t('gospelText')}</p></div>
      <div className="reflection-box"><FideoraMark small /><div><p className="eyebrow">{t('reflection')}</p><p>{t('gospelReflection')}</p></div></div>
    </article>
  );
}

function RosaryDetail({ t, mysteries, progress, onStep }) {
  const [selected, setSelected] = useState(mysteries[0].id);
  const item = mysteries.find((m) => m.id === selected);
  const step = progress[selected] || 0;
  const pct = Math.min(100, (step / ROSARY_STEPS) * 100);
  return (
    <div className="page">
      <PageIntro eyebrow={t('rosary')} title={item.title} subtitle={item.days} />
      <div className="mystery-tabs">{mysteries.map((m) => <button key={m.id} className={selected === m.id ? 'active' : ''} onClick={() => setSelected(m.id)}>{m.title}</button>)}</div>
      <section className="rosary-prayer-card">
        <div className="rosary-orbit"><div style={{ '--progress': `${pct * 3.6}deg` }}><span>{step >= ROSARY_STEPS ? '✓' : step}</span><small>/ {ROSARY_STEPS}</small></div></div>
        <p>{step >= ROSARY_STEPS ? t('completed') : `${step} ${t('mysteryProgress')}`}</p>
        <button className="button primary wide" onClick={() => onStep(selected, step >= ROSARY_STEPS ? 0 : step + 1)}>{step >= ROSARY_STEPS ? t('reset') : t('advancePrayer')}</button>
      </section>
    </div>
  );
}

function PrayerDetail({ prayer }) {
  return <article className="page reading-page prayer-detail"><p className="eyebrow">FIDEORA · ORATIO</p><h1>{prayer.title}</h1><div className="prayer-rule"/><p className="prayer-text">{prayer.text}</p></article>;
}

function NovenaDetail({ t, novena, day, onDay }) {
  const currentDay = day >= 9 ? 9 : Math.max(1, day + 1);
  return (
    <div className="page">
      <PageIntro eyebrow={t('novenas')} title={novena.title} subtitle={novena.purpose} />
      <section className="novena-detail-card">
        <div className="day-medallion"><span>{t('day')}</span><b>{currentDay}</b><small>{t('of')} 9</small></div>
        <p className="prayer-text compact">{t('novenaPrayer')}</p>
        <div className="day-dots">{Array.from({ length: 9 }).map((_, i) => <span key={i} className={i < day ? 'done' : i === day && day < 9 ? 'current' : ''}>{i < day ? <Check size={12}/> : i + 1}</span>)}</div>
        <button className="button primary wide" onClick={() => onDay(day >= 9 ? 0 : day + 1)}>{day >= 9 ? t('reset') : t('markDay')}</button>
      </section>
    </div>
  );
}

function PageIntro({ eyebrow, title, subtitle }) {
  return <section className="page-intro"><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p>{subtitle}</p></section>;
}
function SectionHeader({ title }) { return <div className="section-header"><h2>{title}</h2></div>; }
function ActionRow({ icon, title, subtitle, onClick }) {
  return <button className="action-row" onClick={onClick}><span className="action-icon">{icon}</span><span className="action-copy"><b>{title}</b><small>{subtitle}</small></span><ChevronRight size={18} /></button>;
}

export default function App() {
  return <LanguageProvider><FideoraApp /></LanguageProvider>;
}
