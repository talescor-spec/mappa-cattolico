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
    "giftTitle": "Continua il tuo cammino con Fideora.",
    "giftText": "Trasforma la lettura in un’abitudine di fede con letture quotidiane, preghiere e il Rosario.",
    "activation": "Scarica Fideora e scegli l’offerta disponibile per il tuo account.",
    "eligibility": "Prezzo, periodo introduttivo e rinnovo sono mostrati prima dell’acquisto.",
    "independence": "L’abbonamento è facoltativo e separato dall’acquisto del libro.",
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
    "activationPrompt": "Scarica Fideora e scegli l’offerta disponibile per il tuo account.",
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
    "giftTitle": "Continue sua jornada com o Fideora.",
    "giftText": "Transforme sua leitura em uma rotina de fé com leituras diárias, orações e o Rosário.",
    "activation": "Baixe o Fideora e escolha a oferta disponível para sua conta.",
    "eligibility": "O preço, o período inicial e a renovação aparecem antes da compra.",
    "independence": "A assinatura é opcional e separada da compra do livro.",
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
    "activationPrompt": "Baixe o Fideora e escolha a oferta disponível para sua conta.",
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
    "giftTitle": "Continua o teu caminho com o Fideora.",
    "giftText": "Transforma a tua leitura numa rotina de fé com leituras diárias, orações e o Rosário.",
    "activation": "Descarrega o Fideora e escolhe a oferta disponível para a tua conta.",
    "eligibility": "O preço, o período inicial e a renovação são apresentados antes da compra.",
    "independence": "A assinatura é opcional e separada da compra do livro.",
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
    "activationPrompt": "Descarrega o Fideora e escolhe a oferta disponível para a tua conta.",
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
    "giftTitle": "Continue your journey with Fideora.",
    "giftText": "Turn your reading into a daily habit of faith with daily readings, prayers and the Rosary.",
    "activation": "Download Fideora and choose the offer available for your account.",
    "eligibility": "The price, introductory period and renewal are shown before purchase.",
    "independence": "The optional subscription is separate from your book purchase.",
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
    "activationPrompt": "Download Fideora and choose the offer available for your account.",
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
    "giftTitle": "Poursuivez votre chemin avec Fideora.",
    "giftText": "Faites de votre lecture une habitude de foi avec des lectures quotidiennes, des prières et le Rosaire.",
    "activation": "Téléchargez Fideora et choisissez l’offre disponible pour votre compte.",
    "eligibility": "Le prix, la période de bienvenue et le renouvellement sont affichés avant l’achat.",
    "independence": "L’abonnement facultatif est distinct de l’achat du livre.",
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
    "activationPrompt": "Téléchargez Fideora et choisissez l’offre disponible pour votre compte.",
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
    "giftTitle": "Continúa tu camino con Fideora.",
    "giftText": "Convierte tu lectura en una rutina de fe con lecturas diarias, oraciones y el Rosario.",
    "activation": "Descarga Fideora y elige la oferta disponible para tu cuenta.",
    "eligibility": "El precio, el periodo inicial y la renovación aparecen antes de comprar.",
    "independence": "La suscripción opcional es independiente de la compra del libro.",
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
    "activationPrompt": "Descarga Fideora y elige la oferta disponible para tu cuenta.",
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
    "giftTitle": "Setze deinen Weg mit Fideora fort.",
    "giftText": "Mach deine Lektüre mit täglichen Lesungen, Gebeten und dem Rosenkranz zu einer Gewohnheit im Glauben.",
    "activation": "Lade Fideora herunter und wähle das verfügbare Angebot für dein Konto.",
    "eligibility": "Preis, Einführungszeitraum und Verlängerung werden vor dem Kauf angezeigt.",
    "independence": "Das optionale Abo ist vom Buchkauf getrennt.",
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
    "activationPrompt": "Lade Fideora herunter und wähle das verfügbare Angebot für dein Konto.",
    "downloadCta": "Fideora jetzt herunterladen"
  }
};
  var androidMessages = {
  "it": {
    "androidCta": "Inizia il primo mese a €1",
    "androidDownload": "Primo mese €1 · Poi €19,90/mese",
    "androidAria": "Inizia il primo mese a €1",
    "androidAccess": "Hai già attivato? Accedi a Fideora",
    "androidPrompt": "Attiva il primo mese a €1 su Hotmart, poi accedi a Fideora con la stessa email.",
    "bothPrompt": "Scarica Fideora e scegli l’offerta disponibile per il tuo account. Attiva il primo mese a €1 su Hotmart, poi accedi a Fideora con la stessa email.",
    "androidActivation": "Attiva il primo mese a €1 su Hotmart, poi accedi a Fideora con la stessa email.",
    "bothActivation": "Scarica Fideora e scegli l’offerta disponibile per il tuo account. Attiva il primo mese a €1 su Hotmart, poi accedi a Fideora con la stessa email.",
    "androidEligibility": "€1 per il primo mese, poi €19,90 al mese. Rinnovo automatico; annulla su Hotmart prima del prossimo addebito.",
    "bothEligibility": "Prezzo, periodo introduttivo e rinnovo sono mostrati prima dell’acquisto. €1 per il primo mese, poi €19,90 al mese. Rinnovo automatico; annulla su Hotmart prima del prossimo addebito.",
    "androidReady": "Accesso web su Android dopo l’attivazione su Hotmart."
  },
  "pt-BR": {
    "androidCta": "Começar o primeiro mês por €1",
    "androidDownload": "Primeiro mês €1 · Depois €19,90/mês",
    "androidAria": "Começar o primeiro mês por €1",
    "androidAccess": "Já ativou? Acessar o Fideora",
    "androidPrompt": "Ative o primeiro mês por €1 na Hotmart e acesse o Fideora com o mesmo e-mail.",
    "bothPrompt": "Baixe o Fideora e escolha a oferta disponível para sua conta. Ative o primeiro mês por €1 na Hotmart e acesse o Fideora com o mesmo e-mail.",
    "androidActivation": "Ative o primeiro mês por €1 na Hotmart e acesse o Fideora com o mesmo e-mail.",
    "bothActivation": "Baixe o Fideora e escolha a oferta disponível para sua conta. Ative o primeiro mês por €1 na Hotmart e acesse o Fideora com o mesmo e-mail.",
    "androidEligibility": "€1 no primeiro mês, depois €19,90/mês. Renovação automática; cancele na Hotmart antes da próxima cobrança.",
    "bothEligibility": "O preço, o período inicial e a renovação aparecem antes da compra. €1 no primeiro mês, depois €19,90/mês. Renovação automática; cancele na Hotmart antes da próxima cobrança.",
    "androidReady": "Acesso web no Android após a ativação na Hotmart."
  },
  "pt-PT": {
    "androidCta": "Começar o primeiro mês por €1",
    "androidDownload": "Primeiro mês €1 · Depois €19,90/mês",
    "androidAria": "Começar o primeiro mês por €1",
    "androidAccess": "Já ativaste? Aceder ao Fideora",
    "androidPrompt": "Ativa o primeiro mês por €1 na Hotmart e acede ao Fideora com o mesmo email.",
    "bothPrompt": "Descarrega o Fideora e escolhe a oferta disponível para a tua conta. Ativa o primeiro mês por €1 na Hotmart e acede ao Fideora com o mesmo email.",
    "androidActivation": "Ativa o primeiro mês por €1 na Hotmart e acede ao Fideora com o mesmo email.",
    "bothActivation": "Descarrega o Fideora e escolhe a oferta disponível para a tua conta. Ativa o primeiro mês por €1 na Hotmart e acede ao Fideora com o mesmo email.",
    "androidEligibility": "€1 no primeiro mês, depois €19,90/mês. Renovação automática; cancela na Hotmart antes da próxima cobrança.",
    "bothEligibility": "O preço, o período inicial e a renovação são apresentados antes da compra. €1 no primeiro mês, depois €19,90/mês. Renovação automática; cancela na Hotmart antes da próxima cobrança.",
    "androidReady": "Acesso web no Android após a ativação na Hotmart."
  },
  "en": {
    "androidCta": "Start your first month for €1",
    "androidDownload": "First month €1 · Then €19.90/month",
    "androidAria": "Start your first month for €1",
    "androidAccess": "Already activated? Open Fideora",
    "androidPrompt": "Activate your first month for €1 on Hotmart, then open Fideora with the same email.",
    "bothPrompt": "Download Fideora and choose the offer available for your account. Activate your first month for €1 on Hotmart, then open Fideora with the same email.",
    "androidActivation": "Activate your first month for €1 on Hotmart, then open Fideora with the same email.",
    "bothActivation": "Download Fideora and choose the offer available for your account. Activate your first month for €1 on Hotmart, then open Fideora with the same email.",
    "androidEligibility": "€1 for the first month, then €19.90/month. Automatic renewal; cancel on Hotmart before the next charge.",
    "bothEligibility": "The price, introductory period and renewal are shown before purchase. €1 for the first month, then €19.90/month. Automatic renewal; cancel on Hotmart before the next charge.",
    "androidReady": "Web access on Android after activation on Hotmart."
  },
  "fr": {
    "androidCta": "Commencer le premier mois à 1 €",
    "androidDownload": "Premier mois 1 € · Puis 19,90 €/mois",
    "androidAria": "Commencer le premier mois à 1 €",
    "androidAccess": "Déjà activé ? Ouvrir Fideora",
    "androidPrompt": "Activez le premier mois à 1 € sur Hotmart, puis ouvrez Fideora avec le même e-mail.",
    "bothPrompt": "Téléchargez Fideora et choisissez l’offre disponible pour votre compte. Activez le premier mois à 1 € sur Hotmart, puis ouvrez Fideora avec le même e-mail.",
    "androidActivation": "Activez le premier mois à 1 € sur Hotmart, puis ouvrez Fideora avec le même e-mail.",
    "bothActivation": "Téléchargez Fideora et choisissez l’offre disponible pour votre compte. Activez le premier mois à 1 € sur Hotmart, puis ouvrez Fideora avec le même e-mail.",
    "androidEligibility": "1 € le premier mois, puis 19,90 €/mois. Renouvellement automatique ; annulez sur Hotmart avant le prochain prélèvement.",
    "bothEligibility": "Le prix, la période de bienvenue et le renouvellement sont affichés avant l’achat. 1 € le premier mois, puis 19,90 €/mois. Renouvellement automatique ; annulez sur Hotmart avant le prochain prélèvement.",
    "androidReady": "Accès web sur Android après l’activation sur Hotmart."
  },
  "es": {
    "androidCta": "Empezar el primer mes por 1 €",
    "androidDownload": "Primer mes 1 € · Después 19,90 €/mes",
    "androidAria": "Empezar el primer mes por 1 €",
    "androidAccess": "¿Ya activaste? Abre Fideora",
    "androidPrompt": "Activa el primer mes por 1 € en Hotmart y accede a Fideora con el mismo correo.",
    "bothPrompt": "Descarga Fideora y elige la oferta disponible para tu cuenta. Activa el primer mes por 1 € en Hotmart y accede a Fideora con el mismo correo.",
    "androidActivation": "Activa el primer mes por 1 € en Hotmart y accede a Fideora con el mismo correo.",
    "bothActivation": "Descarga Fideora y elige la oferta disponible para tu cuenta. Activa el primer mes por 1 € en Hotmart y accede a Fideora con el mismo correo.",
    "androidEligibility": "1 € el primer mes, después 19,90 €/mes. Renovación automática; cancela en Hotmart antes del siguiente cobro.",
    "bothEligibility": "El precio, el periodo inicial y la renovación aparecen antes de comprar. 1 € el primer mes, después 19,90 €/mes. Renovación automática; cancela en Hotmart antes del siguiente cobro.",
    "androidReady": "Acceso web en Android tras la activación en Hotmart."
  },
  "de": {
    "androidCta": "Ersten Monat für 1 € starten",
    "androidDownload": "Erster Monat 1 € · Danach 19,90 €/Monat",
    "androidAria": "Ersten Monat für 1 € starten",
    "androidAccess": "Bereits aktiviert? Fideora öffnen",
    "androidPrompt": "Aktiviere den ersten Monat für 1 € bei Hotmart und öffne Fideora mit derselben E-Mail.",
    "bothPrompt": "Lade Fideora herunter und wähle das verfügbare Angebot für dein Konto. Aktiviere den ersten Monat für 1 € bei Hotmart und öffne Fideora mit derselben E-Mail.",
    "androidActivation": "Aktiviere den ersten Monat für 1 € bei Hotmart und öffne Fideora mit derselben E-Mail.",
    "bothActivation": "Lade Fideora herunter und wähle das verfügbare Angebot für dein Konto. Aktiviere den ersten Monat für 1 € bei Hotmart und öffne Fideora mit derselben E-Mail.",
    "androidEligibility": "1 € im ersten Monat, danach 19,90 €/Monat. Automatische Verlängerung; kündige bei Hotmart vor der nächsten Zahlung.",
    "bothEligibility": "Preis, Einführungszeitraum und Verlängerung werden vor dem Kauf angezeigt. 1 € im ersten Monat, danach 19,90 €/Monat. Automatische Verlängerung; kündige bei Hotmart vor der nächsten Zahlung.",
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
  checkoutURL.searchParams.set('off', 't8i2l9ha');
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

