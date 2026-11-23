(function () {
  'use strict';
  var messages = {
  "it": {
    "download": "Continua su App Store",
    "appleAria": "Scarica Fideora su App Store",
    "appleCompatibility": "Per iPhone e iPad",
    "choose": "Scegli la versione per il tuo telefono.",
    "pageTitle": "Grazie per il tuo acquisto — Fideora",
    "purchaseThanks": "Grazie per il tuo acquisto.",
    "bookLabel": "La tua scelta",
    "bookFallback": "Il tuo libro",
    "giftLabel": "Il tuo prossimo passo",
    "giftTitle": "La tua prova gratuita ti aspetta.",
    "giftText": "Trasforma la lettura in un’abitudine di fede con letture quotidiane, preghiere e il Rosario.",
    "activation": "Scarica l’app, apri Fideora e scegli la prova disponibile per il tuo account.",
    "eligibility": "Prova gratuita soggetta ai requisiti di idoneità dello store. Si attiva all’interno dell’app.",
    "independence": "Il libro è già tuo. La prova è facoltativa e non si attiva con l’acquisto del libro.",
    "genericBridge": "La tua lettura è solo l’inizio. Continua il tuo cammino di fede con Fideora.",
    "heroSalutation": "Complimenti!",
    "heroLead": "Hai fatto",
    "heroEmphasis": "un’ottima scelta.",
    "purchaseIntro": "I tuoi materiali sono pronti. Ora fai il prossimo passo nel tuo cammino di fede.",
    "stepsLabel": "Il tuo acquisto e il prossimo passo",
    "stepBookStatus": "Confermato",
    "stepMaterials": "Materiali del tuo acquisto",
    "stepMaterialsStatus": "Inclusi",
    "stepBonus": "Bonus della tua offerta",
    "stepBonusStatus": "Inclusi",
    "stepApp": "App Fideora",
    "stepAppStatus": "Da attivare",
    "activationPrompt": "Scarica Fideora e attiva la tua prova gratuita nell’app per iniziare oggi.",
    "downloadCta": "Scarica Fideora ora"
  },
  "pt-BR": {
    "download": "Continuar na App Store",
    "appleAria": "Baixar Fideora na App Store",
    "appleCompatibility": "Para iPhone e iPad",
    "choose": "Escolha a versão para o seu celular.",
    "pageTitle": "Obrigado pela sua compra — Fideora",
    "purchaseThanks": "Obrigado pela sua compra.",
    "bookLabel": "Sua escolha",
    "bookFallback": "Seu livro",
    "giftLabel": "Seu próximo passo",
    "giftTitle": "Seu teste gratuito está esperando por você.",
    "giftText": "Transforme sua leitura em uma rotina de fé com leituras diárias, orações e o Rosário.",
    "activation": "Baixe o app, abra o Fideora e escolha o teste disponível para sua conta.",
    "eligibility": "Teste gratuito sujeito à elegibilidade na loja. A ativação é feita dentro do app.",
    "independence": "O livro já é seu. O teste é opcional e não é ativado pela compra do livro.",
    "genericBridge": "Sua leitura é só o começo. Continue sua jornada de fé com o Fideora.",
    "heroSalutation": "Parabéns!",
    "heroLead": "Você fez uma",
    "heroEmphasis": "ótima escolha.",
    "purchaseIntro": "Seus materiais estão prontos. Agora, dê o próximo passo na sua jornada de fé.",
    "stepsLabel": "Sua compra e o próximo passo",
    "stepBookStatus": "Confirmado",
    "stepMaterials": "Materiais da sua compra",
    "stepMaterialsStatus": "Incluídos",
    "stepBonus": "Bônus da sua oferta",
    "stepBonusStatus": "Incluídos",
    "stepApp": "Aplicativo Fideora",
    "stepAppStatus": "Para ativar",
    "activationPrompt": "Baixe o Fideora e ative seu teste gratuito no app para começar hoje.",
    "downloadCta": "Baixar Fideora agora"
  },
  "pt-PT": {
    "download": "Continuar na App Store",
    "appleAria": "Descarregar Fideora na App Store",
    "appleCompatibility": "Para iPhone e iPad",
    "choose": "Escolhe a versão para o teu telemóvel.",
    "pageTitle": "Obrigado pela tua compra — Fideora",
    "purchaseThanks": "Obrigado pela tua compra.",
    "bookLabel": "A tua escolha",
    "bookFallback": "O teu livro",
    "giftLabel": "O teu próximo passo",
    "giftTitle": "O teu teste gratuito está à tua espera.",
    "giftText": "Transforma a tua leitura numa rotina de fé com leituras diárias, orações e o Rosário.",
    "activation": "Descarrega a app, abre o Fideora e escolhe o teste disponível para a tua conta.",
    "eligibility": "Teste gratuito sujeito à elegibilidade na loja. A ativação é feita dentro da app.",
    "independence": "O livro já é teu. O teste é opcional e não é ativado pela compra do livro.",
    "genericBridge": "A tua leitura é só o começo. Continua o teu caminho de fé com o Fideora.",
    "heroSalutation": "Parabéns!",
    "heroLead": "Fizeste uma",
    "heroEmphasis": "ótima escolha.",
    "purchaseIntro": "Os teus materiais estão prontos. Agora, dá o próximo passo no teu caminho de fé.",
    "stepsLabel": "A tua compra e o próximo passo",
    "stepBookStatus": "Confirmado",
    "stepMaterials": "Materiais da tua compra",
    "stepMaterialsStatus": "Incluídos",
    "stepBonus": "Bónus da tua oferta",
    "stepBonusStatus": "Incluídos",
    "stepApp": "Aplicação Fideora",
    "stepAppStatus": "Por ativar",
    "activationPrompt": "Descarrega o Fideora e ativa o teu teste gratuito na app para começares hoje.",
    "downloadCta": "Descarregar Fideora agora"
  },
  "en": {
    "download": "Continue to the App Store",
    "appleAria": "Download Fideora on the App Store",
    "appleCompatibility": "For iPhone and iPad",
    "choose": "Choose the version for your phone.",
    "pageTitle": "Thank you for your purchase — Fideora",
    "purchaseThanks": "Thank you for your purchase.",
    "bookLabel": "Your choice",
    "bookFallback": "Your book",
    "giftLabel": "Your next step",
    "giftTitle": "Your free trial is waiting for you.",
    "giftText": "Turn your reading into a daily habit of faith with daily readings, prayers and the Rosary.",
    "activation": "Download the app, open Fideora and choose the trial available for your account.",
    "eligibility": "Free trial subject to store eligibility. Activate it inside the app.",
    "independence": "Your book is already yours. The trial is optional and isn’t activated by buying the book.",
    "genericBridge": "Your reading is just the beginning. Continue your journey of faith with Fideora.",
    "heroSalutation": "Congratulations!",
    "heroLead": "You’ve made",
    "heroEmphasis": "a wonderful choice.",
    "purchaseIntro": "Your materials are ready. Now take the next step on your journey of faith.",
    "stepsLabel": "Your purchase and your next step",
    "stepBookStatus": "Confirmed",
    "stepMaterials": "Your purchased materials",
    "stepMaterialsStatus": "Included",
    "stepBonus": "Your offer’s bonuses",
    "stepBonusStatus": "Included",
    "stepApp": "Fideora app",
    "stepAppStatus": "To activate",
    "activationPrompt": "Download Fideora and activate your free trial in the app to start today.",
    "downloadCta": "Download Fideora now"
  },
  "fr": {
    "download": "Continuer vers l’App Store",
    "appleAria": "Télécharger Fideora sur l’App Store",
    "appleCompatibility": "Pour iPhone et iPad",
    "choose": "Choisissez la version pour votre téléphone.",
    "pageTitle": "Merci pour votre achat — Fideora",
    "purchaseThanks": "Merci pour votre achat.",
    "bookLabel": "Votre choix",
    "bookFallback": "Votre livre",
    "giftLabel": "Votre prochaine étape",
    "giftTitle": "Votre essai gratuit vous attend.",
    "giftText": "Faites de votre lecture une habitude de foi avec des lectures quotidiennes, des prières et le Rosaire.",
    "activation": "Téléchargez l’app, ouvrez Fideora et choisissez l’essai disponible pour votre compte.",
    "eligibility": "Essai gratuit soumis aux critères d’éligibilité de la boutique. Il s’active dans l’app.",
    "independence": "Votre livre vous appartient déjà. L’essai est facultatif et ne s’active pas avec l’achat du livre.",
    "genericBridge": "Votre lecture n’est qu’un début. Poursuivez votre cheminement de foi avec Fideora.",
    "heroSalutation": "Félicitations !",
    "heroLead": "Vous avez fait",
    "heroEmphasis": "un excellent choix.",
    "purchaseIntro": "Vos contenus sont prêts. Faites maintenant le prochain pas dans votre cheminement de foi.",
    "stepsLabel": "Votre achat et la prochaine étape",
    "stepBookStatus": "Confirmé",
    "stepMaterials": "Les contenus de votre achat",
    "stepMaterialsStatus": "Inclus",
    "stepBonus": "Les bonus de votre offre",
    "stepBonusStatus": "Inclus",
    "stepApp": "Application Fideora",
    "stepAppStatus": "À activer",
    "activationPrompt": "Téléchargez Fideora et activez votre essai gratuit dans l’app pour commencer aujourd’hui.",
    "downloadCta": "Télécharger Fideora"
  },
  "es": {
    "download": "Continuar a la App Store",
    "appleAria": "Descargar Fideora en App Store",
    "appleCompatibility": "Para iPhone y iPad",
    "choose": "Elige la versión para tu teléfono.",
    "pageTitle": "Gracias por tu compra — Fideora",
    "purchaseThanks": "Gracias por tu compra.",
    "bookLabel": "Tu elección",
    "bookFallback": "Tu libro",
    "giftLabel": "Tu siguiente paso",
    "giftTitle": "Tu prueba gratuita te está esperando.",
    "giftText": "Convierte tu lectura en una rutina de fe con lecturas diarias, oraciones y el Rosario.",
    "activation": "Descarga la app, abre Fideora y elige la prueba disponible para tu cuenta.",
    "eligibility": "Prueba gratuita sujeta a los requisitos de la tienda. Se activa dentro de la app.",
    "independence": "El libro ya es tuyo. La prueba es opcional y no se activa al comprar el libro.",
    "genericBridge": "Tu lectura es solo el comienzo. Continúa tu camino de fe con Fideora.",
    "heroSalutation": "¡Enhorabuena!",
    "heroLead": "Has hecho",
    "heroEmphasis": "una gran elección.",
    "purchaseIntro": "Tus materiales están listos. Ahora da el siguiente paso en tu camino de fe.",
    "stepsLabel": "Tu compra y el siguiente paso",
    "stepBookStatus": "Confirmado",
    "stepMaterials": "Los materiales de tu compra",
    "stepMaterialsStatus": "Incluidos",
    "stepBonus": "Los bonos de tu oferta",
    "stepBonusStatus": "Incluidos",
    "stepApp": "Aplicación Fideora",
    "stepAppStatus": "Por activar",
    "activationPrompt": "Descarga Fideora y activa tu prueba gratuita en la app para empezar hoy.",
    "downloadCta": "Descargar Fideora ahora"
  },
  "de": {
    "download": "Weiter zum App Store",
    "appleAria": "Fideora im App Store herunterladen",
    "appleCompatibility": "Für iPhone und iPad",
    "choose": "Wähle die Version für dein Smartphone.",
    "pageTitle": "Vielen Dank für deinen Kauf — Fideora",
    "purchaseThanks": "Vielen Dank für deinen Kauf.",
    "bookLabel": "Deine Wahl",
    "bookFallback": "Dein Buch",
    "giftLabel": "Dein nächster Schritt",
    "giftTitle": "Deine kostenlose Testphase wartet auf dich.",
    "giftText": "Mach deine Lektüre mit täglichen Lesungen, Gebeten und dem Rosenkranz zu einer Gewohnheit im Glauben.",
    "activation": "Lade die App herunter, öffne Fideora und wähle die für dein Konto verfügbare Testphase.",
    "eligibility": "Die kostenlose Testphase hängt von der Berechtigung im Store ab. Du aktivierst sie in der App.",
    "independence": "Dein Buch gehört bereits dir. Die Testphase ist freiwillig und wird nicht durch den Buchkauf aktiviert.",
    "genericBridge": "Deine Lektüre ist erst der Anfang. Setze deinen Glaubensweg mit Fideora fort.",
    "heroSalutation": "Glückwunsch!",
    "heroLead": "Du hast",
    "heroEmphasis": "richtig gut gewählt.",
    "purchaseIntro": "Deine Materialien sind bereit. Gehe jetzt den nächsten Schritt auf deinem Glaubensweg.",
    "stepsLabel": "Dein Kauf und der nächste Schritt",
    "stepBookStatus": "Bestätigt",
    "stepMaterials": "Deine gekauften Materialien",
    "stepMaterialsStatus": "Enthalten",
    "stepBonus": "Die Boni deines Angebots",
    "stepBonusStatus": "Enthalten",
    "stepApp": "Fideora-App",
    "stepAppStatus": "Jetzt aktivieren",
    "activationPrompt": "Lade Fideora herunter und aktiviere deine kostenlose Testphase in der App, um heute zu beginnen.",
    "downloadCta": "Fideora jetzt herunterladen"
  }
};
  var androidMessages = {
  "it": {
    "androidCta": "Attiva la prova su Android",
    "androidDownload": "3 giorni di prova · Continua su Hotmart",
    "androidAria": "Attiva la prova Fideora per Android su Hotmart",
    "androidAccess": "Hai già attivato? Accedi a Fideora",
    "androidPrompt": "Attiva 3 giorni di prova su Hotmart, poi accedi a Fideora dal tuo Android.",
    "bothPrompt": "Su iPhone scarica l’app; su Android attiva la prova su Hotmart e accedi a Fideora.",
    "androidActivation": "Dopo l’attivazione su Hotmart, accedi a Fideora con la stessa email usata nel checkout.",
    "bothActivation": "Su iPhone attiva la prova nell’app. Su Android attivala su Hotmart, poi accedi a Fideora con la stessa email.",
    "androidEligibility": "Piano mensile con 3 giorni di prova. Prezzo, rinnovo e condizioni sono indicati su Hotmart prima della conferma.",
    "bothEligibility": "Su iPhone valgono le condizioni dell’App Store. Su Android la prova si attiva su Hotmart, dove prezzo, rinnovo e condizioni sono mostrati prima della conferma.",
    "androidReady": "Accesso web su Android dopo l’attivazione su Hotmart."
  },
  "pt-BR": {
    "androidCta": "Ativar teste no Android",
    "androidDownload": "3 dias de teste · Continuar na Hotmart",
    "androidAria": "Ativar teste do Fideora para Android na Hotmart",
    "androidAccess": "Já ativou? Acessar o Fideora",
    "androidPrompt": "Ative 3 dias de teste na Hotmart e depois acesse o Fideora pelo Android.",
    "bothPrompt": "No iPhone, baixe o app; no Android, ative o teste na Hotmart e acesse o Fideora.",
    "androidActivation": "Após ativar na Hotmart, acesse o Fideora com o mesmo e-mail usado no checkout.",
    "bothActivation": "No iPhone, ative o teste no app. No Android, ative na Hotmart e depois acesse o Fideora com o mesmo e-mail.",
    "androidEligibility": "Plano mensal com 3 dias de teste. Preço, renovação e condições são exibidos na Hotmart antes da confirmação.",
    "bothEligibility": "No iPhone, valem as condições da App Store. No Android, ative na Hotmart, onde preço, renovação e condições aparecem antes da confirmação.",
    "androidReady": "Acesso web no Android após a ativação na Hotmart."
  },
  "pt-PT": {
    "androidCta": "Ativar teste no Android",
    "androidDownload": "3 dias de teste · Continuar na Hotmart",
    "androidAria": "Ativar teste do Fideora para Android na Hotmart",
    "androidAccess": "Já ativaste? Aceder ao Fideora",
    "androidPrompt": "Ativa 3 dias de teste na Hotmart e depois acede ao Fideora no Android.",
    "bothPrompt": "No iPhone, descarrega a app; no Android, ativa o teste na Hotmart e acede ao Fideora.",
    "androidActivation": "Após ativares na Hotmart, acede ao Fideora com o mesmo email usado no checkout.",
    "bothActivation": "No iPhone, ativa o teste na app. No Android, ativa na Hotmart e depois acede ao Fideora com o mesmo email.",
    "androidEligibility": "Plano mensal com 3 dias de teste. O preço, a renovação e as condições são apresentados na Hotmart antes da confirmação.",
    "bothEligibility": "No iPhone, aplicam-se as condições da App Store. No Android, ativa na Hotmart, onde o preço, a renovação e as condições são apresentados antes da confirmação.",
    "androidReady": "Acesso web no Android após a ativação na Hotmart."
  },
  "en": {
    "androidCta": "Start your trial on Android",
    "androidDownload": "3-day trial · Continue to Hotmart",
    "androidAria": "Activate your Fideora Android trial on Hotmart",
    "androidAccess": "Already activated? Open Fideora",
    "androidPrompt": "Activate your 3-day trial on Hotmart, then open Fideora on your Android.",
    "bothPrompt": "On iPhone, download the app; on Android, activate your trial on Hotmart and open Fideora.",
    "androidActivation": "After activating on Hotmart, sign in to Fideora with the same email used at checkout.",
    "bothActivation": "On iPhone, activate your trial in the app. On Android, activate on Hotmart, then sign in to Fideora with the same email.",
    "androidEligibility": "Monthly plan with a 3-day trial. Hotmart shows the price, renewal and terms before you confirm.",
    "bothEligibility": "App Store terms apply on iPhone. On Android, activate on Hotmart, which shows the price, renewal and terms before you confirm.",
    "androidReady": "Web access on Android after activation on Hotmart."
  },
  "fr": {
    "androidCta": "Activer l’essai sur Android",
    "androidDownload": "3 jours d’essai · Continuer vers Hotmart",
    "androidAria": "Activer l’essai Fideora pour Android sur Hotmart",
    "androidAccess": "Déjà activé ? Ouvrir Fideora",
    "androidPrompt": "Activez 3 jours d’essai sur Hotmart, puis ouvrez Fideora sur votre Android.",
    "bothPrompt": "Sur iPhone, téléchargez l’app ; sur Android, activez l’essai sur Hotmart et ouvrez Fideora.",
    "androidActivation": "Après l’activation sur Hotmart, connectez-vous à Fideora avec le même e-mail que lors du paiement.",
    "bothActivation": "Sur iPhone, activez l’essai dans l’app. Sur Android, activez-le sur Hotmart, puis connectez-vous à Fideora avec le même e-mail.",
    "androidEligibility": "Abonnement mensuel avec 3 jours d’essai. Hotmart affiche le prix, le renouvellement et les conditions avant confirmation.",
    "bothEligibility": "Les conditions de l’App Store s’appliquent sur iPhone. Sur Android, activez sur Hotmart, qui affiche le prix, le renouvellement et les conditions avant confirmation.",
    "androidReady": "Accès web sur Android après l’activation sur Hotmart."
  },
  "es": {
    "androidCta": "Activar la prueba en Android",
    "androidDownload": "3 días de prueba · Continuar a Hotmart",
    "androidAria": "Activar la prueba de Fideora para Android en Hotmart",
    "androidAccess": "¿Ya activaste? Abre Fideora",
    "androidPrompt": "Activa 3 días de prueba en Hotmart y después abre Fideora en tu Android.",
    "bothPrompt": "En iPhone, descarga la app; en Android, activa la prueba en Hotmart y abre Fideora.",
    "androidActivation": "Después de activar en Hotmart, accede a Fideora con el mismo correo usado en el checkout.",
    "bothActivation": "En iPhone, activa la prueba en la app. En Android, actívala en Hotmart y accede a Fideora con el mismo correo.",
    "androidEligibility": "Plan mensual con 3 días de prueba. Hotmart muestra el precio, la renovación y las condiciones antes de confirmar.",
    "bothEligibility": "En iPhone se aplican las condiciones de la App Store. En Android, activa en Hotmart, que muestra el precio, la renovación y las condiciones antes de confirmar.",
    "androidReady": "Acceso web en Android tras la activación en Hotmart."
  },
  "de": {
    "androidCta": "Testphase auf Android starten",
    "androidDownload": "3 Tage testen · Weiter zu Hotmart",
    "androidAria": "Fideora-Testphase für Android bei Hotmart aktivieren",
    "androidAccess": "Bereits aktiviert? Fideora öffnen",
    "androidPrompt": "Aktiviere 3 Testtage bei Hotmart und öffne danach Fideora auf deinem Android.",
    "bothPrompt": "Lade auf dem iPhone die App herunter. Aktiviere auf Android die Testphase bei Hotmart und öffne Fideora.",
    "androidActivation": "Melde dich nach der Aktivierung bei Hotmart mit derselben E-Mail-Adresse bei Fideora an, die du beim Checkout verwendet hast.",
    "bothActivation": "Aktiviere die Testphase auf dem iPhone in der App. Aktiviere sie auf Android bei Hotmart und melde dich dann mit derselben E-Mail-Adresse bei Fideora an.",
    "androidEligibility": "Monatsabo mit 3 Testtagen. Preis, Verlängerung und Bedingungen werden bei Hotmart vor der Bestätigung angezeigt.",
    "bothEligibility": "Auf dem iPhone gelten die Bedingungen des App Store. Auf Android aktivierst du bei Hotmart; dort werden Preis, Verlängerung und Bedingungen vor der Bestätigung angezeigt.",
    "androidReady": "Webzugang auf Android nach der Aktivierung bei Hotmart."
  }
};
  Object.keys(messages).forEach(function (key) { Object.assign(messages[key], androidMessages[key]); });
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
  if (device !== 'ios') {
    copy = Object.assign({}, copy, {
      activationPrompt: device === 'android' ? copy.androidPrompt : copy.bothPrompt,
      activation: device === 'android' ? copy.androidActivation : copy.bothActivation,
      eligibility: device === 'android' ? copy.androidEligibility : copy.bothEligibility
    });
  }
  var checkoutURL = new URL('https://pay.hotmart.com/X108495940M');
  checkoutURL.searchParams.set('off', 'e792z6va');
  checkoutURL.searchParams.set('showOnlyTrial', '1');
  checkoutURL.searchParams.set('utm_source', 'fideora_thanks');
  checkoutURL.searchParams.set('utm_medium', 'post_purchase');
  checkoutURL.searchParams.set('utm_campaign', 'ty_' + (funnel || 'generic'));
  ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach(function (key) {
    var value = params.get(key);
    if (value && value.length <= 150 && /^[\p{L}\p{N}_. :-]+$/u.test(value)) checkoutURL.searchParams.set(key, value);
  });
  var accessURL = new URL('/app/', window.location.origin);
  accessURL.searchParams.set('lang', locale.indexOf('pt') === 0 ? 'pt' : 'it');
  root.setAttribute('lang', locale);
  root.setAttribute('data-device', device);
  root.setAttribute('data-funnel', funnel || 'generic');
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
      document.getElementById('android-checkout').href = checkoutURL.href;
      document.getElementById('android-access').href = accessURL.href;
    } finally {
      window.clearTimeout(revealTimer);
      root.removeAttribute('data-localizing');
    }
  }
  window.FideoraThanks = { locale: locale, funnel: funnel, device: device, copy: copy, bookTitle: title, bridge: bridge, apply: apply };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', apply, { once: true });
  else apply();
}());

