(function () {
  'use strict';
  var messages = {
  "it": {
    "download": "Scarica Fideora su",
    "googleDownload": "Scarica Fideora su",
    "appleAria": "Scarica Fideora su App Store",
    "appleCompatibility": "Per iPhone e iPad",
    "googleAria": "Scarica Fideora su Google Play",
    "comingSoon": "Prossimamente su",
    "androidPending": "La versione Android sarà disponibile a breve.",
    "androidReady": "Per telefoni e tablet Android",
    "choose": "Scegli la versione per il tuo telefono.",
    "pageTitle": "Grazie per il tuo acquisto — Fideora",
    "purchaseThanks": "Grazie per il tuo acquisto.",
    "bookLabel": "La tua scelta",
    "bookFallback": "Il tuo libro",
    "giftLabel": "Un regalo per il tuo cammino",
    "giftTitle": "Complimenti! Hai ricevuto una prova gratuita di Fideora.",
    "giftText": "Ora ti basta scaricare l’app per accompagnare il tuo cammino di fede.",
    "activation": "Scarica l’app, apri Fideora e scegli la prova disponibile per il tuo account.",
    "eligibility": "Prova gratuita soggetta ai requisiti di idoneità dello store. Si attiva all’interno dell’app.",
    "independence": "Il libro è già tuo. La prova è facoltativa e non si attiva con l’acquisto del libro.",
    "genericBridge": "La tua lettura è solo l’inizio. Continua il tuo cammino di fede con Fideora."
  },
  "pt-BR": {
    "download": "Baixe o Fideora na",
    "googleDownload": "Baixe o Fideora no",
    "appleAria": "Baixar Fideora na App Store",
    "appleCompatibility": "Para iPhone e iPad",
    "googleAria": "Baixar Fideora no Google Play",
    "comingSoon": "Em breve no",
    "androidPending": "A versão para Android estará disponível em breve.",
    "androidReady": "Para celulares e tablets Android",
    "choose": "Escolha a versão para o seu celular.",
    "pageTitle": "Obrigado pela sua compra — Fideora",
    "purchaseThanks": "Obrigado pela sua compra.",
    "bookLabel": "Sua escolha",
    "bookFallback": "Seu livro",
    "giftLabel": "Um presente para sua jornada",
    "giftTitle": "Parabéns! Você ganhou um teste gratuito do Fideora.",
    "giftText": "Agora é só baixar o app para acompanhar sua jornada de fé.",
    "activation": "Baixe o app, abra o Fideora e escolha o teste disponível para sua conta.",
    "eligibility": "Teste gratuito sujeito à elegibilidade na loja. A ativação é feita dentro do app.",
    "independence": "O livro já é seu. O teste é opcional e não é ativado pela compra do livro.",
    "genericBridge": "Sua leitura é só o começo. Continue sua jornada de fé com o Fideora."
  },
  "pt-PT": {
    "download": "Descarrega o Fideora na",
    "googleDownload": "Descarrega o Fideora no",
    "appleAria": "Descarregar Fideora na App Store",
    "appleCompatibility": "Para iPhone e iPad",
    "googleAria": "Descarregar Fideora no Google Play",
    "comingSoon": "Em breve no",
    "androidPending": "A versão para Android estará disponível em breve.",
    "androidReady": "Para telemóveis e tablets Android",
    "choose": "Escolhe a versão para o teu telemóvel.",
    "pageTitle": "Obrigado pela tua compra — Fideora",
    "purchaseThanks": "Obrigado pela tua compra.",
    "bookLabel": "A tua escolha",
    "bookFallback": "O teu livro",
    "giftLabel": "Um presente para o teu caminho",
    "giftTitle": "Parabéns! Recebeste um teste gratuito do Fideora.",
    "giftText": "Agora basta descarregar a app para acompanhar o teu caminho de fé.",
    "activation": "Descarrega a app, abre o Fideora e escolhe o teste disponível para a tua conta.",
    "eligibility": "Teste gratuito sujeito à elegibilidade na loja. A ativação é feita dentro da app.",
    "independence": "O livro já é teu. O teste é opcional e não é ativado pela compra do livro.",
    "genericBridge": "A tua leitura é só o começo. Continua o teu caminho de fé com o Fideora."
  },
  "en": {
    "download": "Download Fideora on the",
    "googleDownload": "Download Fideora on",
    "appleAria": "Download Fideora on the App Store",
    "appleCompatibility": "For iPhone and iPad",
    "googleAria": "Download Fideora on Google Play",
    "comingSoon": "Coming soon to",
    "androidPending": "The Android version is coming soon.",
    "androidReady": "For Android phones and tablets",
    "choose": "Choose the version for your phone.",
    "pageTitle": "Thank you for your purchase — Fideora",
    "purchaseThanks": "Thank you for your purchase.",
    "bookLabel": "Your choice",
    "bookFallback": "Your book",
    "giftLabel": "A gift for your journey",
    "giftTitle": "Congratulations! You’ve received a free trial of Fideora.",
    "giftText": "Now just download the app to accompany you on your journey of faith.",
    "activation": "Download the app, open Fideora and choose the trial available for your account.",
    "eligibility": "Free trial subject to store eligibility. Activate it inside the app.",
    "independence": "Your book is already yours. The trial is optional and isn’t activated by buying the book.",
    "genericBridge": "Your reading is just the beginning. Continue your journey of faith with Fideora."
  },
  "fr": {
    "download": "Téléchargez Fideora sur",
    "googleDownload": "Téléchargez Fideora sur",
    "appleAria": "Télécharger Fideora sur l’App Store",
    "appleCompatibility": "Pour iPhone et iPad",
    "googleAria": "Télécharger Fideora sur Google Play",
    "comingSoon": "Bientôt sur",
    "androidPending": "La version Android sera bientôt disponible.",
    "androidReady": "Pour téléphones et tablettes Android",
    "choose": "Choisissez la version pour votre téléphone.",
    "pageTitle": "Merci pour votre achat — Fideora",
    "purchaseThanks": "Merci pour votre achat.",
    "bookLabel": "Votre choix",
    "bookFallback": "Votre livre",
    "giftLabel": "Un cadeau pour votre cheminement",
    "giftTitle": "Félicitations ! Vous avez reçu un essai gratuit de Fideora.",
    "giftText": "Il vous suffit maintenant de télécharger l’app pour accompagner votre cheminement de foi.",
    "activation": "Téléchargez l’app, ouvrez Fideora et choisissez l’essai disponible pour votre compte.",
    "eligibility": "Essai gratuit soumis aux critères d’éligibilité de la boutique. Il s’active dans l’app.",
    "independence": "Votre livre vous appartient déjà. L’essai est facultatif et ne s’active pas avec l’achat du livre.",
    "genericBridge": "Votre lecture n’est qu’un début. Poursuivez votre cheminement de foi avec Fideora."
  },
  "es": {
    "download": "Descarga Fideora en",
    "googleDownload": "Descarga Fideora en",
    "appleAria": "Descargar Fideora en App Store",
    "appleCompatibility": "Para iPhone y iPad",
    "googleAria": "Descargar Fideora en Google Play",
    "comingSoon": "Próximamente en",
    "androidPending": "La versión para Android estará disponible pronto.",
    "androidReady": "Para teléfonos y tabletas Android",
    "choose": "Elige la versión para tu teléfono.",
    "pageTitle": "Gracias por tu compra — Fideora",
    "purchaseThanks": "Gracias por tu compra.",
    "bookLabel": "Tu elección",
    "bookFallback": "Tu libro",
    "giftLabel": "Un regalo para tu camino",
    "giftTitle": "¡Enhorabuena! Has recibido una prueba gratuita de Fideora.",
    "giftText": "Ahora solo tienes que descargar la app para acompañar tu camino de fe.",
    "activation": "Descarga la app, abre Fideora y elige la prueba disponible para tu cuenta.",
    "eligibility": "Prueba gratuita sujeta a los requisitos de la tienda. Se activa dentro de la app.",
    "independence": "El libro ya es tuyo. La prueba es opcional y no se activa al comprar el libro.",
    "genericBridge": "Tu lectura es solo el comienzo. Continúa tu camino de fe con Fideora."
  },
  "de": {
    "download": "Fideora herunterladen im",
    "googleDownload": "Fideora herunterladen bei",
    "appleAria": "Fideora im App Store herunterladen",
    "appleCompatibility": "Für iPhone und iPad",
    "googleAria": "Fideora bei Google Play herunterladen",
    "comingSoon": "Demnächst bei",
    "androidPending": "Die Android-Version ist bald verfügbar.",
    "androidReady": "Für Android-Smartphones und -Tablets",
    "choose": "Wähle die Version für dein Smartphone.",
    "pageTitle": "Vielen Dank für deinen Kauf — Fideora",
    "purchaseThanks": "Vielen Dank für deinen Kauf.",
    "bookLabel": "Deine Wahl",
    "bookFallback": "Dein Buch",
    "giftLabel": "Ein Geschenk für deinen Glaubensweg",
    "giftTitle": "Herzlichen Glückwunsch! Du hast eine kostenlose Testphase für Fideora erhalten.",
    "giftText": "Lade jetzt einfach die App herunter und lass dich auf deinem Glaubensweg begleiten.",
    "activation": "Lade die App herunter, öffne Fideora und wähle die für dein Konto verfügbare Testphase.",
    "eligibility": "Die kostenlose Testphase hängt von der Berechtigung im Store ab. Du aktivierst sie in der App.",
    "independence": "Dein Buch gehört bereits dir. Die Testphase ist freiwillig und wird nicht durch den Buchkauf aktiviert.",
    "genericBridge": "Deine Lektüre ist erst der Anfang. Setze deinen Glaubensweg mit Fideora fort."
  }
};
  var books = {
  "mdb": {
    "titles": {
      "pt-BR": "Mapa da Bíblia",
      "it": "Mappa della Bibbia",
      "en": "The Bible Map",
      "fr": "Carte de la Bible",
      "es": "Mapa de la Biblia",
      "de": "Die Bibelkarte"
    },
    "bridges": {
      "pt-BR": "A compreensão da Bíblia ganha vida quando se torna parte da sua rotina.",
      "pt-PT": "A compreensão da Bíblia ganha vida quando passa a fazer parte da tua rotina.",
      "it": "La comprensione della Bibbia prende vita quando diventa parte della tua quotidianità.",
      "en": "Understanding the Bible comes to life when it becomes part of your daily routine.",
      "fr": "La compréhension de la Bible prend vie lorsqu’elle fait partie de votre quotidien.",
      "es": "Comprender la Biblia cobra vida cuando forma parte de tu día a día.",
      "de": "Das Verständnis der Bibel wird lebendig, wenn es Teil deines Alltags wird."
    }
  },
  "mdc": {
    "titles": {
      "pt-BR": "Mapa do Catecismo",
      "it": "Mappa del Catechismo",
      "en": "The Catechism Map",
      "fr": "Carte du Catéchisme",
      "es": "Mapa del Catecismo",
      "de": "Die Katechismuskarte"
    },
    "bridges": {
      "pt-BR": "Continue aprofundando sua fé com um momento diário de leitura e oração.",
      "pt-PT": "Continua a aprofundar a tua fé com um momento diário de leitura e oração.",
      "it": "Continua ad approfondire la tua fede con un momento quotidiano di lettura e preghiera.",
      "en": "Keep deepening your faith with a daily moment of reading and prayer.",
      "fr": "Continuez à approfondir votre foi avec un moment quotidien de lecture et de prière.",
      "es": "Sigue profundizando en tu fe con un momento diario de lectura y oración.",
      "de": "Vertiefe deinen Glauben mit einem täglichen Moment der Lektüre und des Gebets."
    }
  },
  "ldj": {
    "titles": {
      "pt-BR": "50 Lições Ilustradas de Jesus Cristo",
      "it": "50 Lezioni Illustrate di Gesù Cristo",
      "en": "50 Illustrated Lessons of Jesus Christ",
      "fr": "50 Leçons Illustrées de Jésus-Christ",
      "es": "50 Lecciones Ilustradas de Jesucristo",
      "de": "50 illustrierte Lehren Jesu Christi"
    },
    "bridges": {
      "pt-BR": "Leve os ensinamentos de Jesus para as pequenas escolhas de cada dia.",
      "pt-PT": "Leva os ensinamentos de Jesus para as pequenas escolhas de cada dia.",
      "it": "Porta gli insegnamenti di Gesù nelle piccole scelte di ogni giorno.",
      "en": "Bring the teachings of Jesus into the small choices of every day.",
      "fr": "Faites vivre les enseignements de Jésus dans les petits choix du quotidien.",
      "es": "Lleva las enseñanzas de Jesús a las pequeñas decisiones de cada día.",
      "de": "Lass die Lehren Jesu in den kleinen Entscheidungen deines Alltags lebendig werden."
    }
  },
  "mdn": {
    "titles": {
      "pt-BR": "Mapa do Natal",
      "it": "Mappa del Natale",
      "en": "The Christmas Map",
      "fr": "La Carte de Noël",
      "es": "Mapa de Navidad",
      "de": "Die Karte der Weihnachtsgeschichte"
    },
    "bridges": {
      "pt-BR": "Leve a mensagem do Natal para sua jornada de fé, todos os dias.",
      "pt-PT": "Leva a mensagem do Natal para o teu caminho de fé, todos os dias.",
      "it": "Porta il messaggio del Natale nel tuo cammino di fede, ogni giorno.",
      "en": "Carry the message of Christmas into your journey of faith, every day.",
      "fr": "Gardez le message de Noël dans votre cheminement de foi, chaque jour.",
      "es": "Lleva el mensaje de Navidad a tu camino de fe, cada día.",
      "de": "Nimm die Botschaft von Weihnachten mit auf deinen täglichen Glaubensweg."
    }
  },
  "apc": {
    "titles": {
      "pt-BR": "Atlas das Escrituras",
      "it": "Atlante delle Scritture",
      "en": "Atlas of Scripture",
      "fr": "Atlas des Écritures",
      "es": "Atlas de las Escrituras",
      "de": "Atlas der Heiligen Schrift"
    },
    "bridges": {
      "pt-BR": "Continue sua jornada pelas Escrituras com leituras, orações e reflexões.",
      "pt-PT": "Continua o teu caminho pelas Escrituras com leituras, orações e reflexões.",
      "it": "Continua il tuo cammino nelle Scritture con letture, preghiere e riflessioni.",
      "en": "Continue your journey through Scripture with readings, prayers and reflections.",
      "fr": "Poursuivez votre cheminement dans les Écritures avec lectures, prières et réflexions.",
      "es": "Continúa tu camino por las Escrituras con lecturas, oraciones y reflexiones.",
      "de": "Setze deinen Weg durch die Heilige Schrift mit Lesungen, Gebeten und Gedanken fort."
    }
  }
};
  var root = document.documentElement;
  var params;
  try { params = new URLSearchParams(window.location.search); } catch (error) { params = new URLSearchParams(); }
  function supportedLocale(value) {
    var tag = String(value || '').trim().replace(/_/g, '-').toLowerCase();
    if (tag === 'pt-pt' || tag.indexOf('pt-pt-') === 0) return 'pt-PT';
    if (tag === 'pt' || tag.indexOf('pt-') === 0) return 'pt-BR';
    var base = tag.split('-')[0];
    return Object.prototype.hasOwnProperty.call(messages, base) ? base : null;
  }
  var preferences = Array.isArray(navigator.languages) ? navigator.languages : [];
  var candidates = [params.get('lang') || ''].concat(preferences, navigator.language || '');
  var locale = 'en';
  for (var i = 0; i < candidates.length; i++) {
    var matched = supportedLocale(candidates[i]);
    if (matched) { locale = matched; break; }
  }
  var defaultFunnel = document.querySelector('meta[name="fideora-default-funnel"]');
  var rawFunnel = params.get('funil') || params.get('funnel') || (defaultFunnel && defaultFunnel.content) || '';
  var code = rawFunnel.toLowerCase().trim().split(/[-_]/)[0];
  var funnel = Object.prototype.hasOwnProperty.call(books, code) ? code : '';
  var book = funnel ? books[funnel] : null;
  var bookLocale = locale === 'pt-PT' ? 'pt-BR' : locale;
  var copy = messages[locale];
  var title = book ? (book.titles[bookLocale] || book.titles.en) : copy.bookFallback;
  var bridge = book ? (book.bridges[locale] || book.bridges.en) : copy.genericBridge;
  var ua = navigator.userAgent || '';
  var platform = (navigator.userAgentData && navigator.userAgentData.platform) || '';
  var isAndroid = /android/i.test(platform) || /android/i.test(ua);
  var isIOS = /iPad|iPhone|iPod/i.test(ua) || /ios/i.test(platform) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  var device = isAndroid ? 'android' : isIOS ? 'ios' : 'desktop';
  var playMeta = document.querySelector('meta[name="fideora-google-play-url"]');
  var playURL = '';
  try {
    if (playMeta && playMeta.content.trim()) {
      var url = new URL(playMeta.content.trim());
      if (url.protocol === 'https:' && url.hostname === 'play.google.com' &&
          url.pathname === '/store/apps/details' && url.searchParams.get('id')) playURL = url.href;
    }
  } catch (error) {}
  root.setAttribute('lang', locale);
  root.setAttribute('data-device', device);
  root.setAttribute('data-funnel', funnel || 'generic');
  root.setAttribute('data-play-ready', playURL ? 'true' : 'false');
  root.setAttribute('data-localizing', '');
  var revealTimer = window.setTimeout(function () {
    root.setAttribute('lang', 'it');
    root.removeAttribute('data-localizing');
  }, 2500);
  function apply() {
    try {
      document.querySelectorAll('[data-i18n]').forEach(function (element) {
        var key = element.getAttribute('data-i18n');
        if (typeof copy[key] === 'string') element.textContent = copy[key];
      });
      document.querySelectorAll('[data-i18n-aria]').forEach(function (element) {
        var key = element.getAttribute('data-i18n-aria');
        if (typeof copy[key] === 'string') element.setAttribute('aria-label', copy[key]);
      });
      document.getElementById('purchased-book-title').textContent = title;
      document.getElementById('book-bridge').textContent = bridge;
      document.title = copy.pageTitle + (book ? ' · ' + title : '');
      document.querySelector('meta[name="description"]').setAttribute('content', copy.giftText);
      if (playURL) {
        var link = document.getElementById('google-play-download');
        link.href = playURL;
        link.hidden = false;
        document.getElementById('google-play-pending').hidden = true;
        document.getElementById('android-compatibility').textContent = copy.androidReady;
      }
    } finally {
      window.clearTimeout(revealTimer);
      root.removeAttribute('data-localizing');
    }
  }
  window.FideoraThanks = { locale: locale, funnel: funnel, device: device, copy: copy, bookTitle: title, bridge: bridge, apply: apply };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', apply, { once: true });
  else apply();
}());
