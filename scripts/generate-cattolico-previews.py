"""Original editorial sample plates for the Mappa del Cattolico offer.

Sources for the structure (original summaries, no reproduced source passages):
https://www.vatican.va/archive/compendium_ccc/documents/archive_2005_compendium-ccc_it.html
https://www.vatican.va/roman_curia/congregations/ccdds/documents/rc_con_ccdds_doc_20030317_ordinamento-messale_it.html
"""
from html import escape
from pathlib import Path
import textwrap

OUT=Path('website/mappa-della-bibbia/assets')
def text(x,y,value,size=24,color='#18392f',serif=False):
    font='Georgia,serif' if serif else 'Arial,sans-serif'
    return f'<text x="{x}" y="{y}" font-family="{font}" font-size="{size}" fill="{color}">{escape(value)}</text>'
def paragraph(x,y,value,width=47,size=23,leading=34,color='#586355'):
    return ''.join(text(x,y+i*leading,line,size,color) for i,line in enumerate(textwrap.wrap(value,width=width)))
def shell(title,subtitle):
    return '<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="960" viewBox="0 0 1280 960" role="img" aria-label="'+escape(title)+'"><rect width="1280" height="960" fill="#f8f4eb"/><rect x="28" y="28" width="1224" height="904" fill="none" stroke="#c6af7d"/>'+text(70,78,'F I D E O R A',18)+text(872,78,'LA MAPPA DEL CATTOLICO',15,'#8b7040')+'<path d="M70 102H1210" stroke="#c6af7d"/>'+text(70,174,title,53,serif=True)+text(70,223,subtitle,25,'#7b795f')+text(70,895,'TAVOLA EDITORIALE DIMOSTRATIVA · SPIEGAZIONI ORIGINALI',15,'#8b7040')
def save(name,s): (OUT/name).write_text(s+'</svg>')

s=shell('Quattro pilastri, un unico cammino','Una mappa per collegare ciò che credi, celebri, vivi e preghi.')
cards=[(70,280,'Credere','Il Credo','La professione di fede apre lo sguardo su Dio Padre, su Gesù Cristo e sullo Spirito Santo.'),(665,280,'Celebrare','I sacramenti','La vita della Chiesa si esprime nella liturgia e nei sette sacramenti.'),(70,560,'Vivere','La vita cristiana','Le Beatitudini, i comandamenti e le virtù orientano le scelte di ogni giorno.'),(665,560,'Pregare','La preghiera','Il dialogo con Dio accompagna la vita; il Padre nostro ne offre un riferimento centrale.')]
for x,y,verb,title,body in cards:
    s+=f'<rect x="{x}" y="{y}" width="545" height="245" rx="8" fill="#ece6d8"/>'+text(x+28,y+42,verb.upper(),17,'#8b7040')+text(x+28,y+94,title,35,serif=True)+paragraph(x+28,y+135,body,width=43,size=23,leading=32)
s+=text(70,850,'Riferimento: le quattro parti del Catechismo della Chiesa Cattolica.',19,'#8b7040')
save('preview-cattolico-fede.svg',s)

s=shell('Il filo della Messa','Parola ed Eucaristia, unite in un solo atto di culto.')
rows=[('Riti di introduzione','Radunarsi e prepararsi','Il saluto, l’atto penitenziale e l’orazione introducono la celebrazione.'),('Liturgia della Parola','Ascoltare e rispondere','Letture, Vangelo, omelia e preghiera dei fedeli accompagnano l’ascolto.'),('Liturgia eucaristica','Offrire, rendere grazie, ricevere','Dalla preparazione dei doni alla Preghiera eucaristica e alla Comunione.'),('Riti di conclusione','Portare il cammino nella vita','La benedizione e il congedo aprono alla testimonianza quotidiana.')]
for i,(title,verb,body) in enumerate(rows):
    y=278+i*140
    s+=f'<rect x="70" y="{y}" width="1140" height="120" rx="5" fill="'+('#18392f' if i==2 else '#ece6d8')+'"/>'
    ink='#f8f4eb' if i==2 else '#18392f'
    s+=text(100,y+46,title,32,ink,True)+text(100,y+81,verb,19,'#cfb57d' if i==2 else '#8b7040')+paragraph(590,y+45,body,width=48,size=22,leading=31,color='#f0e9dc' if i==2 else '#586355')
s+=text(70,850,'Riferimento: Ordinamento Generale del Messale Romano, nn. 28 e 46–90.',18,'#8b7040')
save('preview-cattolico-messa.svg',s)

s=shell('Dalla comprensione alla preghiera','Un piccolo spazio da abitare ogni giorno, con continuità.')
for y,verb,body in [(290,'Leggi','Scegli un breve brano del Vangelo. Osserva il contesto e rileggi con calma.'),(460,'Fermati','Quale parola o domanda ti accompagna oggi? Annota ciò che desideri comprendere.'),(630,'Prega e porta nella vita','Rivolgiti a Dio con parole semplici. Scegli un piccolo gesto concreto per la giornata.')]:
    s+=f'<path d="M70 {y-25}H1210" stroke="#c6af7d"/>'+text(75,y+30,verb,39,serif=True)+paragraph(570,y+18,body,width=46,size=24,leading=36)
s+='<rect x="70" y="785" width="1140" height="65" fill="#18392f"/>'+text(105,826,'La costanza si costruisce un passo alla volta.',27,'#f8f4eb',True)
save('preview-cattolico-preghiera.svg',s)
print('Generated three original Cattolico sample plates.')
