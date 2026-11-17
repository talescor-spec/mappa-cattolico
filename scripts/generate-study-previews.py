"""Original, readable editorial sample pages; no AI-generated diagram text."""
from pathlib import Path
from html import escape
import textwrap

OUT = Path('website/mappa-della-bibbia/assets')
OUT.mkdir(parents=True, exist_ok=True)

def text(x, y, value, size=17, fill='#4b564a', serif=False, italic=False):
    font = 'Georgia,serif' if serif else 'Arial,sans-serif'
    return f'<text x="{x}" y="{y}" font-family="{font}" font-size="{size}" fill="{fill}"' + (' font-style="italic"' if italic else '') + f'>{escape(value)}</text>'

def paragraph(x, y, value, width=61, size=17, leading=27):
    lines = textwrap.wrap(value, width=width)
    return ''.join(text(x, y+i*leading, line, size) for i, line in enumerate(lines)), y+len(lines)*leading

def shell(section, number, title):
    return f'<svg xmlns="http://www.w3.org/2000/svg" width="720" height="960" viewBox="0 0 720 960" role="img" aria-label="{escape(title)}"><rect width="720" height="960" fill="#fbf7ed"/><rect x="26" y="26" width="668" height="908" fill="none" stroke="#c5ad7c"/><path d="M49 65H671 M49 895H671" stroke="#b79b65" fill="none"/>' + text(50,52,'F I D E O R A',12,'#18392f',True) + text(480,52,section,10,'#8e7547') + text(50,920,'EDIZIONE STUDIO CATTOLICA · PAGINA CAMPIONE',9,'#97866a') + text(650,920,number,10,'#8e7547')

def save(name, content):
    (OUT/name).write_text(content+'</svg>', encoding='utf-8')

s=shell('IL MAPPA DEI LIBRI'.replace('IL MAPPA','LA MAPPA'),'01','Pagina campione: il Vangelo secondo Luca')
s+=text(55,113,'IL VANGELO SECONDO',11,'#9c7c43')+text(52,174,'Luca',62,'#18392f',True)
s+=text(55,214,'Un viaggio che continua negli Atti.',23,'#67704f',True,True)
p,_=paragraph(55,260,'Il racconto di Gesù e la storia della prima comunità si incontrano in un percorso che continua negli Atti degli Apostoli. Leggi ogni episodio nel movimento dell’intera narrazione.',62,17)
s+=p
s+='<rect x="55" y="353" width="610" height="170" rx="2" fill="#eee7d7"/>'
s+=text(78,389,'IL FILO DEL RACCONTO',11,'#8e7547')
s+='<path d="M90 436H625" stroke="#b19560" stroke-width="2"/>'
for x,a,b in [(95,'Gli inizi','Lc 1–2'),(270,'Il ministero','Lc 3–9'),(445,'Il cammino','Lc 9–19'),(620,'Gerusalemme','Lc 19–24')]:
    s+=f'<circle cx="{x}" cy="436" r="6" fill="#ad8b50"/>'
    anchor='start' if x==95 else 'end' if x==620 else 'middle'
    s+=f'<text x="{x}" y="468" text-anchor="{anchor}" font-family="Georgia,serif" font-size="17" fill="#18392f">{a}</text>'
    s+=f'<text x="{x}" y="491" text-anchor="{anchor}" font-family="Arial,sans-serif" font-size="12" fill="#756c57">{b}</text>'
s+=text(55,568,'Tre fili da seguire',29,'#18392f',True)
for yy,head,body in [(611,'La misericordia','Osserva gli incontri, le parabole e le risposte di Gesù.'),(679,'Il cammino','Nota come luoghi e spostamenti danno forma al racconto.'),(747,'La preghiera','Fermati sui momenti in cui Gesù e i discepoli pregano.')]:
    s+=text(55,yy,head,19,'#18392f',True)+text(55,yy+27,body,15)
s+=text(55,831,'Per collegare: Lc 1,1–4 · Lc 24,13–35 · At 1,1–3',13,'#8e7547')
s+=text(55,858,'Commento editoriale originale. Il testo completo è in preparazione.',11,'#8b8576')
save('preview-luca.svg',s)

s=shell('LETTURA GUIDATA','02','Pagina campione: il cammino di Emmaus')
s+=text(55,113,'LUCA 24,13–35',11,'#9c7c43')+text(52,172,'Il cammino di Emmaus',43,'#18392f',True)
s+=text(55,213,'Dal racconto alle tue domande.',23,'#67704f',True,True)
p,_=paragraph(55,257,'Due discepoli camminano e raccontano ciò che è accaduto. Gesù si avvicina, ascolta e accompagna la loro lettura delle Scritture. Il racconto invita a seguire il passaggio dalla delusione al riconoscimento.',63,17)
s+=p
for yy,num,head,body in [(390,'01','Il contesto','Leggi la scena insieme agli altri episodi della risurrezione in Luca 24.'),(493,'02','I movimenti della pagina','Nota il cammino, il dialogo, l’ascolto delle Scritture e il gesto della mensa.'),(596,'03','Un dettaglio da osservare','Confronta ciò che i discepoli comprendono durante il cammino con ciò che riconoscono dopo.')]:
    s+='<path d="M55 '+str(yy-23)+'H665" stroke="#d2c3a5"/>'
    s+=text(55,yy,num,12,'#a1844e')+text(97,yy,head,23,'#18392f',True)
    p,_=paragraph(97,yy+30,body,55,16,25)
    s+=p
s+='<rect x="55" y="713" width="610" height="112" fill="#18392f"/>'
s+=text(77,748,'FERMATI E RIFLETTI',10,'#d1ba87')
s+=text(77,783,'Quale domanda porteresti in quel cammino?',21,'#f8f4eb',True,True)
s+=text(55,859,'Riferimento: Lc 24,13–35 · Spiegazione editoriale, distinta dalla Scrittura.',11,'#8b8576')
save('preview-emmaus.svg',s)

s=shell('IL TUO PERCORSO','03','Pagina campione: quaderno di lettura personale')
s+=text(55,113,'UNA PAGINA ALLA VOLTA',11,'#9c7c43')+text(52,174,'Leggi. Fermati. Annota.',43,'#18392f',True)
s+=text(55,216,'Uno spazio per ciò che scopri.',23,'#67704f',True,True)
s+='<rect x="55" y="256" width="610" height="92" fill="#eee7d7"/>'
s+=text(78,287,'OGGI LEGGO',10,'#8e7547')+text(78,321,'Luca 24,13–35 · Il cammino di Emmaus',23,'#18392f',True)
for yy,num,head,body in [(398,'I','Che cosa racconta la pagina?','Scrivi con parole tue ciò che accade nel testo.'),(538,'II','Quale domanda mi lascia?','Scegli un dettaglio o una frase da rileggere con calma.'),(678,'III','Quale piccolo passo posso fare?','Trasforma la riflessione in un proposito concreto.')]:
    s+=text(55,yy,num,21,'#ad8b50',True,True)+text(91,yy,head,24,'#18392f',True)+text(91,yy+30,body,14)
    for liney in [yy+66,yy+94]: s+=f'<path d="M91 {liney}H665" stroke="#d2c3a5"/>'
s+=text(55,848,'La lettura continua: Lc 24,36–49.',16,'#67704f',True,True)
s+=text(55,872,'Pagina di lavoro originale · Esempio del percorso personale.',11,'#8b8576')
save('preview-percorso.svg',s)
print('Generated three readable original editorial sample pages.')
