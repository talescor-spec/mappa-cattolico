const language = new URLSearchParams(window.location.search).get('lang') === 'pt' ? 'pt' : 'it';
document.documentElement.lang = language === 'pt' ? 'pt-BR' : 'it-IT';
document.querySelectorAll('section[lang]').forEach(section => { section.hidden = section.lang !== language; });
