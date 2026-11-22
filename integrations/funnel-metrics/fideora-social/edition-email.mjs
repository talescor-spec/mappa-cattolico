// Fixed editorial copy for updated-edition journeys only. Existing sequences
// and customers keep their previously reviewed content and schedules.
export function editionRecoveryMessage(edition,step){
 if(!edition||!['a','b'].includes(edition.variant)||![1,2,3].includes(Number(step)))return null;
 const name=edition.variant==='a'?'Mappa della Bibbia':'Panorama Biblico';
 const productName=`${name} · Edizione Approfondita 2.0`;
 const offer=`<strong>${productName}</strong>, con <strong>La Mappa del Catechismo</strong> e <strong>La Mappa della Messa</strong>: <strong>€27, pagamento unico, nessun abbonamento</strong>.`;
 const rows={
  1:{subject:`${name} 2.0: riprendi il tuo ordine`,preheader:'Il libro e i due bonus, €27 in un unico pagamento.',body_html:`<p>Puoi riprendere l’ordine che hai iniziato: ${offer}</p><p>La nuova edizione approfondisce i 73 libri del canone cattolico, con collegamenti biblici spiegati, un confronto dei quattro Vangeli e percorsi di lettura.</p><p>Il pulsante riapre i tuoi dati, che puoi controllare e modificare prima di continuare al pagamento sicuro su Mundpay.</p><p>Riceverai le istruzioni di accesso dopo la conferma del pagamento. La garanzia Fideora è di 60 giorni dalla data di acquisto. Se hai già acquistato o hai bisogno di aiuto, rispondi a questa email.</p>`,cta_label:'Riprendi il tuo ordine'},
  2:{subject:'Un filo per collegare ciò che leggi',preheader:'73 libri, connessioni spiegate e due guide bonus incluse.',body_html:`<p>Un nome, un luogo, una promessa: a volte serve un filo per collegarli.</p><p>${productName} unisce sintesi, percorsi dei libri, riferimenti biblici e cinque mappe con collegamenti spiegati. Le letture verso il Natale e il quaderno aiutano a tornare al testo con una domanda concreta.</p><p>Il pacchetto comprende ${offer}</p><p>Puoi rivedere la tua scelta dal pulsante. Se hai già completato l’acquisto, segui le istruzioni ricevute da Mundpay; per assistenza, rispondi a questa email.</p>`,cta_label:'Rivedi la nuova edizione'},
  3:{subject:'Ti serve una mano per completare l’ordine?',preheader:'L’ultimo promemoria relativo alla tua richiesta.',body_html:`<p>Ti lascio un ultimo collegamento al percorso che hai scelto: ${offer}</p><p>Se ti sei fermato per un dubbio sul contenuto, sul pagamento o sull’accesso ai file, puoi rispondere a questa email.</p><p>Hai già acquistato? Segui le istruzioni della conferma Mundpay. Se invece preferisci fermarti qui, non riceverai altri promemoria di questa sequenza.</p>`,cta_label:'Riprendi la tua scelta'},
 };
 return {productName,message:rows[Number(step)]};
}
