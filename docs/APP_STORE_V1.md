# Fideora V1 — App Store package

Updated 21 October 2026. Italian and Portuguese version descriptions, keywords, support/marketing URLs, copyright, reviewer notes and manual release mode saved in App Store Connect. No build uploaded or submission made. App Privacy policy URLs saved for Italian and Portuguese; six collected data types configured for App Functionality, linked to identity, no tracking; draft not published pending signed-build/infrastructure verification. Age rating saved: calculated 13+.

## Store configuration

- Name: Fideora
- Primary language: Italian
- Additional localization: Portuguese (Brazil)
- Category confirmed: Reference; secondary Lifestyle. Italian and Portuguese subtitles confirmed.
- Registered Bundle ID: com.fideora.app; Apple team CZ7QKZBQC8; app ID 6825337165; SKU FIDEORA_IOS_V1
- Version: 1.0.0; initial build number 1
- Minimum native target: iOS 15
- V1 contains no active in-app purchase offer or paywall. Do not describe a trial, subscription or recurring price without a separate configured and tested release.
- Privacy URL: https://mappa-cattolico.vercel.app/privacy.html
- Support URL: https://mappa-cattolico.vercel.app/support.html
- Terms URL: https://mappa-cattolico.vercel.app/terms.html
- Canonical production is deployed with V1. Apple record: https://appstoreconnect.apple.com/apps/6825337165/distribution. The account banner requires the Account Holder to accept the updated Paid Applications Schedule in Business; no agreement was accepted by the agent.

## Italian listing

**Subtitle:** Bibbia, preghiera e studio

**Promotional text:** Uno spazio per leggere la Bibbia, pregare il Rosario e custodire i tuoi studi. In italiano e portoghese, con letture disponibili anche offline.

**Description:**

La tua fede, ogni giorno.

Fideora accompagna il tuo tempo di lettura, studio e preghiera con un’interfaccia essenziale e raccolta.

Leggi le edizioni storiche Diodati 1649 e Almeida 1819, scegli libro e capitolo e cerca le parole che desideri approfondire. Tocca un versetto per aggiungere una nota, un colore o un preferito. Regola la dimensione del testo secondo le tue preferenze.

Nel Quaderno puoi scrivere studi e riflessioni personali, fissare quelli più importanti e ritrovare i versetti salvati. Quattro guide originali e otto schede introduttive di greco ed ebraico ti aiutano a leggere nel contesto, con riferimenti da consultare.

Dedica un momento al Rosario guidato, alle preghiere della tradizione e ai percorsi devozionali di nove giorni. Conserva le tue intenzioni in uno spazio privato.

Puoi iniziare senza un account. L’account facoltativo consente di sincronizzare il profilo e il progresso; note e intenzioni si sincronizzano soltanto se scegli di abilitarlo. Puoi esportare i dati ed eliminare l’account dal Profilo.

Le edizioni bibliche incluse contengono 66 libri ciascuna e non comprendono i sette libri deuterocanonici del canone cattolico. Non sono edizioni liturgiche ufficiali. La selezione quotidiana segue un ciclo editoriale di 14 letture, distinto dal lezionario della Messa. Il glossario è introduttivo e non è un interlineare completo. Fideora è un progetto indipendente.

**Keywords:** bibbia,rosario,preghiere,novena,studio,versetti,quaderno,fede,meditazione,vangelo

## Portuguese listing

**Subtitle:** Bíblia, oração e reflexão

**Promotional text:** Um espaço para escutar a Palavra, rezar com calma e guardar seus pensamentos. Em italiano e português, com leituras disponíveis também offline.

**Description:**

Sua fé, todos os dias.

Fideora acompanha seu tempo de leitura, estudo e oração com uma interface simples e acolhedora.

Leia as edições históricas Diodati 1649 e Almeida 1819, escolha livro e capítulo e busque as palavras que deseja aprofundar. Toque em um versículo para adicionar uma nota, uma cor ou um favorito. Ajuste o tamanho do texto à sua preferência.

No Caderno você pode escrever estudos e reflexões, fixar os mais importantes e reencontrar os versículos salvos. Quatro guias originais e oito verbetes introdutórios de grego e hebraico ajudam a ler em contexto, com referências para consultar.

Dedique um momento ao Rosário guiado, às orações tradicionais e aos caminhos devocionais de nove dias. Guarde suas intenções em um espaço privado.

Comece sem conta. A conta opcional permite sincronizar perfil e progresso; notas e intenções só sincronizam se você ativar essa opção. Exporte seus dados e exclua a conta pelo Perfil.

As edições bíblicas incluídas têm 66 livros cada e não contêm os sete deuterocanônicos do cânon católico. Não são edições litúrgicas oficiais. A seleção diária segue um ciclo editorial de 14 leituras, distinto do lecionário da Missa. O glossário é introdutório, não um interlinear completo. Fideora é um projeto independente.

**Keywords:** bíblia,rosário,orações,novena,estudo,versículos,caderno,fé,meditação,evangelho

## App Privacy draft — verify against the final signed build

No tracking; no advertising. Optional account data is linked to the account and used for app functionality:

| Apple category                    | App data                                                              |
| --------------------------------- | --------------------------------------------------------------------- |
| Contact Info / Name               | Optional display name                                                 |
| Contact Info / Email Address      | Account sign-in email                                                 |
| Identifiers / User ID             | Supabase account UUID                                                 |
| User Content / Other User Content | Notes, study documents, bookmarks and intentions when sync is enabled |
| Sensitive Info                    | Religious beliefs potentially present in voluntarily synced content   |
| Usage Data / Product Interaction  | Prayer and reading progress associated with an account                |

Guest data stays on-device. Notebook sync requires explicit opt-in. Hosting/security IP logs and infrastructure retention must be confirmed in the final privacy declaration and policy. Do not select “Data Not Collected” for the app as a whole. No ATT prompt is needed for the implemented non-tracking behavior; reassess if a tracking SDK is added.

## App Review Notes (English)

Fideora is an independent Catholic devotional and personal Bible-study application. Its primary language is Italian. Portuguese can be selected on the first launch or in Profile.

All included reading, study and prayer features can be reviewed without an account or purchase. Dismiss onboarding with “Inizia il tuo cammino”. Open “Bibbia”, choose a book/chapter and tap a verse to add highlights, notes or bookmarks. “Quaderno” contains the notebook, saved verses, four editorial guides and eight introductory lexical cards. “Prega” includes a guided Rosary, traditional prayers, nine-day devotional tracks and a private intention journal.

The Bible editions are historical public-domain 66-book editions and are identified in Sources. They do not include the seven Catholic deuterocanonical books and are not official liturgical editions. Daily reading is an editorial devotional selection on a 14-reading cycle, not the liturgical lectionary. There is no generative AI or user-to-user content sharing.

An optional email account enables profile/progress sync. Notebook and intention sync is disabled until the user opts in. Account deletion is initiated in Profile, and data export is also available there. Supply a separately verified review account or demonstrate the email login flow before final submission; none is claimed to exist in this draft.

There are no active IAP offers in this V1. Do not list an IAP, trial or premium promise for this build.

## Required screenshots and acceptance

Capture actual final signed/simulator app screens at Apple's required dimensions for the supported devices: Today; Bible reader; verse annotation; notebook/library; Rosary; Profile. Capture both languages and check all text fits. Browser-responsive QA images are design evidence only, not automatically App Store screenshot deliverables.

Confirm review contact name, phone, email, developer legal identity, content rights, age-rating questionnaire, availability, registered bundle and signed physical-device tests in the actual Apple record. No invented contact details are supplied here.
