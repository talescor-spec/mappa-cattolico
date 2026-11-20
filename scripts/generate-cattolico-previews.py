"""Original illustrated atlas samples, with editable, exact SVG typography.
Sources are documented in SOURCES below and in the visible reference footers.
The church plan represents the order of the Roman rite, not walking directions.
Emmaus is a narrative map, not an archaeological reconstruction.
"""
from pathlib import Path
from html import escape
from functools import lru_cache
import json, math
import re
from PIL import ImageFont

OUT=Path('website/mappa-della-bibbia/assets')
PAPER,INK,GREEN,GOLD='#f7f2e8','#1c382f','#173d32','#bf9853'
NAVY,RED,MUTED,LINE='#193746','#964e3c','#5d6a5f','#d7c7a6'
SOURCES={
'catechism':'https://www.vatican.va/archive/compendium_ccc/documents/archive_2005_compendium-ccc_it.html',
'mass':'https://www.vatican.va/roman_curia/congregations/ccdds/documents/rc_con_ccdds_doc_20030317_ordinamento-messale_it.html',
'emmaus':'https://www.vatican.va/archive/ITA0001/_PVK.HTM',
'lectio':'https://www.vatican.va/content/benedict-xvi/it/apost_exhortations/documents/hf_ben-xvi_exh_20100930_verbum-domini.html'}
@lru_cache(None)
def font(size,serif=False,bold=False):
    family='DejaVuSerif' if serif else 'DejaVuSans'
    return ImageFont.truetype('/usr/share/fonts/truetype/dejavu/'+family+('-Bold' if bold else '')+'.ttf',size)
def wrap(value,width,size,bold=False):
    result=[]; line=''; f=font(size,bold=bold)
    for word in value.split():
        nxt=(line+' '+word).strip()
        if line and f.getlength(nxt)>width: result.append(line); line=word
        else: line=nxt
    if line: result.append(line)
    return result
DEFS='''<defs>
<linearGradient id="paper" x2="1" y2="1"><stop stop-color="#fffaf0"/><stop offset="1" stop-color="#e9dfca"/></linearGradient>
<linearGradient id="sky" x2="0" y2="1"><stop stop-color="#efe3c7"/><stop offset="1" stop-color="#d8e2cf"/></linearGradient>
<linearGradient id="gold" x2="1" y2="1"><stop stop-color="#e7cc8e"/><stop offset=".55" stop-color="#b48b44"/><stop offset="1" stop-color="#eddbb0"/></linearGradient>
<pattern id="hatch" width="12" height="12" patternUnits="userSpaceOnUse"><path d="M-3 12L12-3M9 15L15 9" stroke="#173d32" stroke-width="1" opacity=".10"/></pattern>
<marker id="arrow-gold" viewBox="0 0 12 12" refX="10" refY="6" markerWidth="9" markerHeight="9" orient="auto"><path d="M0 1L11 6L0 11Z" fill="#bf9853"/></marker>
<marker id="arrow-red" viewBox="0 0 12 12" refX="10" refY="6" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 1L11 6L0 11Z" fill="#964e3c"/></marker>
<marker id="arrow-green" viewBox="0 0 12 12" refX="10" refY="6" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 1L11 6L0 11Z" fill="#173d32"/></marker>
<symbol id="book" viewBox="0 0 160 140"><path d="M80 32C50 10 16 17 5 20V111C34 105 55 110 80 127C105 110 127 105 155 111V20C132 14 104 16 80 32Z" fill="#fff8e7" stroke="#ad8741" stroke-width="5"/><path d="M80 34V123M17 34C40 30 57 34 69 43M17 49C38 45 55 49 69 57M17 65C37 61 55 65 69 73M17 81C38 78 54 80 69 90M92 43C109 33 128 31 144 34M92 59C110 48 127 47 144 50M92 76C112 64 126 64 144 67M92 92C110 81 127 81 144 84" fill="none" stroke="#ad8741" stroke-width="3"/><path d="M107 17V65L119 56L130 60V17" fill="#964e3c"/></symbol>
<symbol id="chalice" viewBox="0 0 150 170"><g fill="none" stroke="#bf9853" stroke-width="3"><circle cx="75" cy="36" r="31" fill="#fff8e7"/><path d="M75 14V56M57 35H93M42 34H23M108 34H127"/></g><path d="M30 76H120C119 111 103 126 81 128V149H108V160H42V149H69V128C47 126 31 111 30 76Z" fill="#d8b568" stroke="#a47d3c" stroke-width="3"/><path d="M41 87C43 103 48 111 60 116M79 130V148" fill="none" stroke="#fff5d4" stroke-width="3"/></symbol>
<symbol id="heart" viewBox="0 0 160 150"><path d="M80 108C59 90 23 65 23 39C23 7 63 1 80 27C96 0 138 8 138 39C138 65 101 91 80 108Z" fill="#b76c50" stroke="#8f4d3a" stroke-width="3"/><path d="M6 97C30 94 39 108 54 112L80 119L111 109C124 95 140 93 155 97L142 128L81 144L18 126Z" fill="#e5cb9c" stroke="#a9844d" stroke-width="4"/><path d="M23 107L58 125M140 107L107 124" fill="none" stroke="#a9844d" stroke-width="3"/></symbol>
<symbol id="dove" viewBox="0 0 180 140"><path d="M91 76C62 66 23 21 4 12C12 51 37 77 63 90C39 88 20 93 7 106C34 121 61 118 82 102C97 110 114 105 122 93L143 77L177 70L151 60C142 40 119 40 110 56C119 37 116 19 113 4C91 32 84 58 91 76Z" fill="#fff8e7" stroke="#b38d49" stroke-width="4"/><path d="M20 33L65 78M15 54L57 84M107 27L102 65" stroke="#c3a46a" stroke-width="3" fill="none"/><circle cx="138" cy="61" r="3" fill="#173d32"/><path d="M157 79Q168 96 162 115M161 99L173 94M163 107L153 101" stroke="#667e51" stroke-width="4" fill="none"/></symbol>
<symbol id="prayer" viewBox="0 0 160 160"><path d="M76 18C67 31 62 55 57 71L30 103L13 137L44 150L73 110L81 65L90 110L117 149L148 136L131 102L105 71C98 47 95 30 85 18L80 63Z" fill="#d9bd8e" stroke="#9e793f" stroke-width="4"/><path d="M62 70L73 109M98 70L90 110M22 122L49 137M111 137L138 121" stroke="#fff3d7" stroke-width="3" fill="none"/></symbol>
<symbol id="scroll" viewBox="0 0 170 145"><path d="M33 15H143C158 15 163 27 158 43H136V120C136 141 108 141 103 125H24C8 125 6 104 17 96H32V28C32 12 10 9 10 27H31" fill="#efe0ba" stroke="#ae8848" stroke-width="4"/><path d="M47 40H125M47 57H121M47 74H123M47 91H114M28 97H106C95 109 98 125 106 128" fill="none" stroke="#b89a63" stroke-width="3"/></symbol>
<symbol id="church" viewBox="0 0 180 150"><path d="M17 145V62L61 26L88 49V16H119V64L164 93V145Z" fill="#e6d2a4" stroke="#ad8741" stroke-width="4"/><path d="M20 63H84M105 3V34M91 15H119M83 145V103Q103 75 123 103V145M37 91H54V112H37M135 108H149V126H135" stroke="#ad8741" stroke-width="4" fill="none"/></symbol>
<symbol id="bread" viewBox="0 0 180 130"><ellipse cx="90" cy="105" rx="84" ry="17" fill="#c5b691" opacity=".4"/><path d="M9 86C4 52 22 24 69 21L82 90L31 111C15 106 10 98 9 86Z" fill="#d2a464" stroke="#986d37" stroke-width="4"/><path d="M97 20C142 15 173 42 170 78C168 96 147 108 117 111L92 91Z" fill="#edc58a" stroke="#986d37" stroke-width="4"/><path d="M34 44L54 68M27 69L46 87M126 37L113 65M147 52L132 81" stroke="#a37a44" stroke-width="5" fill="none"/></symbol>
</defs>'''

class Plate:
    def __init__(self,title,description,number,chapter,dark=False):
        self.items=[f'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1920" height="1440" viewBox="0 0 1920 1440" role="img" aria-labelledby="title description"><title id="title">{escape(title)}</title><desc id="description">{escape(description)}</desc><metadata>{escape(json.dumps(SOURCES))}</metadata>',DEFS];self.bounds=[]
        self.rect(0,0,1920,1440,PAPER);self.rect(22,22,1876,1396,'none',GOLD)
        if dark:self.rect(0,0,1920,230,NAVY)
        c='#e7d5ae' if dark else INK
        self.text(80,78,'F I D E O R A',23,c,weight='600')
        self.text(520,78,'LA MAPPA DEL CATTOLICO',20,c,spacing=2)
        self.text(1840,78,f'{chapter}  /  {number}',19,c,anchor='end',spacing=1)
        self.path('M80 105H1840',stroke=GOLD)
        self.text(80,177,title,66,'#fff9ed' if dark else INK,serif=True)
    def add(self,s):self.items.append(s)
    def rect(self,x,y,w,h,fill,stroke='none',sw=1,rx=0):
        self.add(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}"/>')
    def circle(self,x,y,r,fill,stroke='none',sw=1):
        self.add(f'<circle cx="{x}" cy="{y}" r="{r}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}"/>')
    def path(self,d,fill='none',stroke='none',width=1,extra=''):
        self.add(f'<path d="{d}" fill="{fill}" stroke="{stroke}" stroke-width="{width}" stroke-linecap="round" stroke-linejoin="round" {extra}/>')
    def text(self,x,y,value,size=24,fill=INK,serif=False,weight='400',anchor='start',spacing=0):
        fam='Georgia,serif' if serif else 'Arial,sans-serif'
        self.add(f'<text x="{x}" y="{y}" fill="{fill}" font-family="{fam}" font-size="{size}" font-weight="{weight}" text-anchor="{anchor}" letter-spacing="{spacing}">{escape(value)}</text>')
        w=font(size,serif,weight in ['600','700']).getlength(value)+max(0,len(value)-1)*spacing
        left=x-w if anchor=='end' else x-w/2 if anchor=='middle' else x
        self.bounds.append((left,y-size,left+w,y+size*.25,value))
    def para(self,x,y,value,width,size=25,fill=MUTED,leading=None,weight='400'):
        leading=leading or size*1.36;lines=wrap(value,width,size,weight in ['600','700'])
        for i,line in enumerate(lines):self.text(x,y+i*leading,line,size,fill,weight=weight)
        return y+len(lines)*leading
    def label(self,x,y,value,fill=RED,size=18,anchor='start'):
        self.text(x,y,value.upper(),size,fill,weight='600',spacing=1.8,anchor=anchor)
    def use(self,name,x,y,w,h=None):
        # Explicit transforms preserve icon sizing in both browsers and PDF renderers.
        match=re.search(r'<symbol id="'+name+r'" viewBox="0 0 (\d+) (\d+)">(.*?)</symbol>',DEFS)
        vw,vh=map(float,match.group(1,2));h=h or w;scale=min(w/vw,h/vh)
        xx=x+(w-vw*scale)/2;yy=y+(h-vh*scale)/2
        self.add(f'<g transform="translate({xx} {yy}) scale({scale})">{match.group(3)}</g>')
    def numbered(self,x,y,n,color=GREEN,r=23):
        self.circle(x,y,r,color,PAPER,4);self.text(x,y+8,str(n).zfill(2),21,'#fff9ed',weight='700',anchor='middle')
    def footer(self,left,right):
        self.path('M80 1358H1840',stroke=LINE)
        self.text(80,1395,left,18,MUTED);self.text(1840,1395,right,18,MUTED,anchor='end')
    def save(self,name):
        over=[b for b in self.bounds if b[0]<35 or b[2]>1888 or b[1]<20 or b[3]>1415]
        if over:raise ValueError(f'Out-of-bounds text in {name}: {over}')
        OUT.mkdir(parents=True,exist_ok=True);(OUT/name).write_text(''.join(self.items)+'</svg>',encoding='utf-8')

def rays(p,x,y,r):
    for a in range(0,360,15):
        a=math.radians(a)
        p.path(f'M{x+(r+8)*math.cos(a):.1f} {y+(r+8)*math.sin(a):.1f}L{x+(r+23)*math.cos(a):.1f} {y+(r+23)*math.sin(a):.1f}',stroke=GOLD,width=2)
def person(p,x,y,scale=1,robe=GREEN,halo=False,lean=0):
    p.add(f'<g transform="translate({x} {y}) scale({scale}) rotate({lean})">')
    if halo:
        p.circle(0,-88,26,'none',GOLD,5);p.path('M0-110V-67M-21-88H21',stroke=GOLD,width=2)
    p.circle(0,-88,16,'#c49b72',INK,2)
    p.path('M-15-69Q-37-49-40 14L-30 35L28 35Q23-17 11-62Z',fill=robe,stroke='#5a5b46',width=2)
    p.path('M-13-64L3 28M-27-43L-9-30L21-42',stroke='#e6d4ae',width=3)
    p.path('M-23 34L-37 57L-22 60M17 35L35 54L49 54',stroke='#6c5a42',width=6);p.add('</g>')

def faith():
    p=Plate('La fede cattolica, in una sola mappa','Cristo al centro; quattro rami collegano Credo, sacramenti, vita cristiana e preghiera. Scrittura, Tradizione e servizio del Magistero chiariscono le relazioni.','01','CREDERE E VIVERE')
    p.text(80,222,'Segui i rami: la fede professata, celebrata, vissuta e pregata appartiene a un unico cammino.',27,MUTED)
    for d,c in [
        ('M80 282Q80 255 110 255H640Q730 255 730 345V650H150Q80 650 80 580Z','#e9e6d8'),
        ('M1190 345Q1190 255 1280 255H1810Q1840 255 1840 282V580Q1840 650 1770 650H1190Z','#e3e9df'),
        ('M80 776Q80 716 143 716H730V1015Q730 1105 640 1105H110Q80 1105 80 1070Z','#efe2d5'),
        ('M1190 716H1777Q1840 716 1840 776V1070Q1840 1105 1810 1105H1280Q1190 1105 1190 1015Z','#e2e8e9')]:p.path(d,fill=c)
    for d,c in [('M835 520C747 510 802 286 655 286',GREEN),('M1085 520C1173 510 1118 286 1265 286',GREEN),('M828 700C748 707 792 1030 664 1030',RED),('M1092 700C1172 707 1128 1030 1256 1030',NAVY)]:p.path(d,stroke=c,width=8)
    p.path('M960 811V824M960 1026V1090M960 1045C960 1124 684 1073 684 1150M960 1045C960 1124 1240 1073 1240 1150',stroke=GOLD,width=10)
    p.label(960,281,'Dio Trinità',fill=INK,anchor='middle',size=20)
    p.text(960,321,'Un solo Dio, tre Persone',27,INK,serif=True,anchor='middle')
    p.text(960,356,'Padre · Figlio · Spirito Santo',23,MUTED,anchor='middle');p.use('dove',912,378,96,73)
    p.circle(960,620,191,GREEN,GOLD,6);p.circle(960,620,176,'none','#7f976e');rays(p,960,515,44)
    p.path('M947 457H973V507H1018V533H973V589H947V533H902V507H947Z',fill='#dfc385')
    p.text(960,650,'Gesù Cristo',45,'#fff8e7',serif=True,anchor='middle')
    p.text(960,693,'Vero Dio e vero uomo',25,'#e6d3a7',anchor='middle')
    p.text(960,737,'La sua Pasqua è il centro.',23,'#fff8e7',anchor='middle')
    p.label(960,851,'Un legame concreto',anchor='middle',size=17);p.text(960,892,'La domenica',35,INK,serif=True,anchor='middle')
    for i,name in enumerate(['book','chalice','heart','prayer']):
        x=780+i*105;p.use(name,x,916,62,65)
        if i<3:p.path(f'M{x+68} 948H{x+93}',stroke=GOLD,width=3,extra='marker-end="url(#arrow-gold)"')
    p.text(960,1010,'Pasqua, Eucaristia, carità, preghiera.',21,MUTED,anchor='middle')
    regions=[
    (116,282,'book','Credere','In chi ripongo la mia fede?',GREEN,[('Il Credo','Trinità, Incarnazione e Pasqua.'),('La Chiesa','Una, santa, cattolica e apostolica.'),('La speranza','Risurrezione e vita eterna.')],'CCC 26–1065'),
    (1226,282,'chalice','Celebrare','Come ricevo la vita di Cristo?',GREEN,[('Iniziazione','Battesimo, Confermazione, Eucaristia.'),('Guarigione','Riconciliazione; Unzione degli infermi.'),('Comunione e missione','Ordine e Matrimonio.')],'CCC 1066–1690'),
    (116,742,'heart','Vivere','Come diventa concreta la fede?',RED,[('La carità','Amore di Dio e del prossimo.'),('Il discernimento','Coscienza, comandamenti e virtù.'),('La vita nuova','La grazia sostiene le opere di bene.')],'CCC 1691–2557'),
    (1226,742,'prayer','Pregare','Come rispondo al dono di Dio?',NAVY,[('Una relazione','Ascolto, fiducia e dialogo con Dio.'),('Le forme','Lode, domanda e intercessione.'),('Il riferimento','Il Padre nostro orienta la preghiera.')],'CCC 2558–2865')]
    for x,y,icon,title,q,color,topics,ref in regions:
        p.circle(x+58,y+66,65,PAPER,GOLD,2);p.use(icon,x+10,y+16,97,98)
        p.text(x+153,y+54,title,48,color,serif=True);p.text(x+153,y+94,q,23,color)
        for j,(heading,body) in enumerate(topics):
            yy=y+148+j*65;p.circle(x+155,yy-9,4,color);p.text(x+172,yy,heading,24,color,weight='600')
            size=21 if font(21).getlength(body)<=420 else 20
            assert font(size).getlength(body)<=425,body
            p.text(x+172,yy+30,body,size,MUTED)
        p.text(x+25,y+351,ref,18,color)
    p.rect(80,1114,1760,210,GREEN,rx=8);p.use('book',110,1150,115,100);p.use('scroll',231,1150,110,100)
    p.label(374,1160,'Un solo deposito della fede',fill='#dfc48c',size=18);p.text(374,1205,'Scrittura e Tradizione',34,'#fff8e7',serif=True)
    p.para(374,1241,'Trasmettono la Rivelazione e sono strettamente unite nella vita della Chiesa.',630,24,fill='#e1e7d7',leading=32)
    p.path('M1050 1146V1292',stroke='#6a8164');p.use('church',1090,1150,119,110)
    p.label(1242,1160,'Al servizio della Parola',fill='#dfc48c',size=18);p.text(1242,1205,'Il Magistero',34,'#fff8e7',serif=True)
    p.para(1242,1241,'Papa e vescovi in comunione con lui ne custodiscono l’interpretazione autentica.',540,24,fill='#e1e7d7',leading=32)
    p.footer('Riferimenti: Catechismo, quattro parti; CCC 80–95 e 232–260.','TAVOLA CAMPIONE · SINTESI EDITORIALE ORIGINALE');p.save('preview-cattolico-fede.svg')

def mass():
    p=Plate('La Messa: dall’ascolto alla missione','Una pianta simbolica di chiesa mette in relazione dodici snodi del rito romano, ambone e altare. Un ingrandimento spiega la Preghiera eucaristica.','02','CELEBRARE',True)
    p.text(80,219,'Due parti principali, Parola ed Eucaristia, formano un solo atto di culto.',27,'#e4d8be')
    p.rect(615,273,690,835,'#e8e0cf',LINE,2,rx=20)
    p.path('M747 1065V616H645V489H747V440C747 190 1173 190 1173 440V489H1275V616H1173V1065Z',fill='#fff9ed',stroke='#b8ac91',width=17)
    p.path('M778 1050V633H678V514H778V443C778 240 1142 240 1142 443V514H1242V633H1142V1050Z',fill='#f2eddf',stroke=LINE,width=2)
    p.path('M882 1067H1036',stroke=PAPER,width=23);p.path('M882 1071L916 1047M1036 1071L1005 1047',stroke=GOLD,width=4)
    p.path('M953 282V342M927 303H979',stroke=GOLD,width=9);p.rect(870,365,190,82,GREEN,GOLD,4,rx=5)
    p.path('M885 375H1045V397H885Z',fill='#efe5cd',stroke=GOLD,width=2);p.use('chalice',928,337,66,82)
    p.label(960,476,'Altare',fill=GREEN,size=18,anchor='middle')
    p.rect(702,548,81,55,RED,GOLD,3,rx=3);p.path('M718 603V633H769V603',fill='#bb9c6d',stroke='#987d51',width=3);p.use('book',692,493,100,78)
    p.label(715,671,'Ambone',size=16,anchor='middle')
    for y in [744,803,862,921,980]:
        for x in [767,1066]:
            p.rect(x,y,88,22,'#ac8b5e','#8f714a',2,rx=3);p.rect(x+8,y+23,72,10,'#d1b78b')
    p.label(960,1131,'Assemblea',fill=GREEN,anchor='middle',size=18)
    points=[(925,1005),(879,925),(838,833),(800,731),(814,615),(888,548),(977,493),(1071,406),(1145,551),(1124,697),(1087,835),(1004,1005)]
    route='M925 1053C931 986 861 916 838 833S773 727 814 615S894 545 977 493S1031 385 1071 406S1171 505 1145 551S1135 630 1124 697S1100 798 1087 835S1050 967 1004 1005L998 1085'
    p.path(route,stroke=GOLD,width=25);p.path(route,stroke='#fff7dd',width=3,extra='stroke-dasharray="2 15"')
    p.path('M1015 1080L1053 1126',stroke=RED,width=4,extra='marker-end="url(#arrow-red)"')
    records=[
    ('Ingresso e saluto','La comunità si raduna nel nome della Trinità.',RED),
    ('Atto penitenziale','Riconosciamo il peccato e chiediamo misericordia.',RED),
    ('Gloria e colletta','Il Gloria, quando previsto; poi la preghiera comune.',RED),
    ('Letture e salmo','Ascoltiamo le Scritture e rispondiamo nella fede.',GREEN),
    ('Vangelo e omelia','L’annuncio di Cristo viene spiegato alla comunità.',GREEN),
    ('Credo e intercessioni','Il Credo quando previsto; preghiamo per tutti.',GREEN),
    ('Presentazione dei doni','Pane e vino preparano la mensa eucaristica.',NAVY),
    ('Preghiera eucaristica','Rendiamo grazie: il memoriale della Pasqua.',NAVY),
    ('Padre nostro e pace','Preghiera filiale e comunione fraterna.',NAVY),
    ('Frazione del pane','Il pane spezzato manifesta l’unità in Cristo.',NAVY),
    ('Comunione e silenzio','Riceviamo Cristo e sostiamo nel ringraziamento.',NAVY),
    ('Benedizione e congedo','La celebrazione continua nella testimonianza.',RED)]
    for i,(title,body,color) in enumerate(records):
        left=i<6;y=(962-i*132) if left else (302+(i-6)*132);x=80 if left else 1360;px,py=points[i];edge=597 if left else 1330
        p.path(f'M{px} {py}L{edge} {y+20}',stroke=color,width=1.8);p.numbered(px,py,i+1,color)
        p.label(x,y+3,f'{i+1:02} · '+('INTRODUZIONE' if i<3 else 'PAROLA' if i<6 else 'EUCARISTIA' if i<11 else 'CONCLUSIONE'),fill=color,size=15)
        p.text(x,y+42,title,29,color,serif=True);p.para(x,y+78,body,475,23,fill=MUTED,leading=30)
    p.rect(80,1165,1760,165,NAVY,rx=8);p.label(106,1205,'Dentro la Preghiera eucaristica',fill='#dfc48c',size=18)
    nodes=[('EPICLESI','Lo Spirito è invocato sui doni e sull’assemblea.'),('ISTITUZIONE','Le parole e i gesti di Gesù nell’Ultima Cena.'),('ANAMNESI E OFFERTA','La Chiesa fa memoria della Pasqua e offre Cristo al Padre.'),('DOSSOLOGIA E AMEN','Dopo le intercessioni, la lode finale e l’assenso del popolo.')]
    for i,(a,b) in enumerate(nodes):
        x=110+i*437;p.text(x,1254,a,22,'#e2c98f',weight='600');p.para(x,1284,b,365,19,fill='#f8f2e5',leading=25)
        if i<3:p.path(f'M{x+360} 1245H{x+400}',stroke=GOLD,width=3,extra='marker-end="url(#arrow-gold)"')
    p.footer('Rito romano: OGMR 28 e 46–90; CCC 1346–1389.','PIANTA SIMBOLICA · LE TAPPE SEGUONO IL RITO');p.save('preview-cattolico-messa.svg')

def city(p,x,y,scale=1):
    p.add(f'<g transform="translate({x} {y}) scale({scale})">')
    for xx,yy,w,h in [(-120,-15,52,82),(-74,-53,58,120),(-24,-14,60,80),(22,-75,67,141),(81,-29,58,94)]:
        p.rect(xx,yy,w,h,'#dcc7a0','#8d7e5a',3);p.path(f'M{xx} {yy}L{xx+w/2} {yy-28}L{xx+w} {yy}Z',fill='#ae8262',stroke='#8d7e5a',width=2);p.rect(xx+14,yy+20,14,24,'#6d7059')
    p.path('M-145 48H160V109H-145Z',fill='#ccb48a',stroke='#8d7e5a',width=4)
    for xx in range(-140,160,24):p.rect(xx,35,15,18,'#ccb48a','#8d7e5a',2)
    p.path('M-15 109V76Q11 42 38 76V109Z',fill='#6b7057',stroke='#8d7e5a',width=3);p.add('</g>')

def emmaus():
    p=Plate('Emmaus: dalla Parola alla vita','Una mappa narrativa di Luca 24 collega i discepoli, le Scritture, il pane e il ritorno a Gerusalemme. Cinque passaggi guidano una lettura orante concreta.','03','LEGGERE E PREGARE')
    p.text(80,223,'Luca 24,13–35 · Nel giorno della risurrezione, due discepoli incontrano Gesù lungo la strada.',27,MUTED)
    recs=[('Partire','13–24','Clèopa e l’altro discepolo raccontano la loro delusione. Gesù si avvicina, ma non viene riconosciuto.'),('Ascoltare','25–27','Gesù rilegge Mosè e i Profeti: le Scritture illuminano la sua Pasqua.'),('Riconoscere','28–32','L’ospitalità conduce alla mensa. Nel pane spezzato riconoscono Gesù, che scompare alla vista.'),('Ritornare','33–35','Ripartono verso Gerusalemme e raccontano alla comunità ciò che è accaduto.')]
    for i,(title,ref,body) in enumerate(recs):
        x=80+i*445;p.numbered(x+24,284,i+1,GREEN if i%2 else RED,22);p.text(x+66,294,title,33,INK,serif=True)
        p.text(x+66,329,'Lc 24,'+ref,19,RED);p.para(x+6,359,body,393,22,fill=MUTED,leading=29)
    p.rect(80,460,1760,554,'#e8dfc4',LINE,2,rx=10);p.circle(1575,538,53,'#e6c878')
    p.path('M81 649Q300 476 551 600T1047 576T1515 567T1840 602V1013H81Z',fill='#c4cba7')
    p.path('M81 748Q252 603 535 721T1009 699T1469 689T1840 728V1013H81Z',fill='#a8b794')
    d='M81 857Q350 734 608 830T1125 803T1580 841T1840 780V1013H81Z';p.path(d,fill='#829e7f')
    for d in ['M108 692Q300 563 506 640','M938 626Q1155 563 1363 634','M1260 901Q1510 854 1765 913','M150 941Q300 868 462 898']:p.path(d,stroke='#f1edd8',width=2)
    city(p,281,649,.86);p.label(283,785,'Gerusalemme',fill=INK,anchor='middle',size=21);p.text(283,817,'Da qui partono. Qui ritornano.',20,INK,anchor='middle')
    p.path('M1456 620H1718V797H1456Z',fill='#e2cb9c',stroke='#7b7756',width=4)
    p.path('M1427 624L1580 515L1746 624Z',fill='#926f53',stroke='#6d654b',width=4)
    p.path('M1536 797V707Q1580 646 1624 707V797Z',fill='#516651',stroke='#7b7756',width=4)
    p.rect(1476,670,38,48,'#69795d','#7b7756',3);p.rect(1655,670,38,48,'#69795d','#7b7756',3);p.label(1585,855,'Emmaus',fill=INK,anchor='middle',size=23)
    route='M405 716C535 734 549 621 737 626S953 747 1071 692S1264 592 1459 737'
    p.path(route,stroke='#e3c495',width=32);p.path(route,stroke=RED,width=7,extra='marker-end="url(#arrow-red)"')
    p.path('M1444 880C1233 946 1075 871 900 920S594 947 415 858',stroke=GREEN,width=6,extra='stroke-dasharray="13 12" marker-end="url(#arrow-green)"')
    p.text(938,994,'Il ritorno: dall’incontro alla testimonianza.',24,'#fff8e7',serif=True,anchor='middle')
    person(p,482,648,.63,NAVY,lean=-9);person(p,542,657,.65,RED,lean=-7)
    person(p,894,649,.73,'#efe1c5',halo=True);person(p,823,671,.62,RED);person(p,962,665,.67,GREEN)
    p.use('book',1015,545,116,92);p.circle(1069,535,61,'none',GOLD,2)
    p.rect(1374,755,232,24,'#87664b','#614c38',3,rx=10);p.path('M1393 780L1381 838M1588 780L1601 838',stroke='#614c38',width=7)
    person(p,1451,737,.59,'#efe1c5',halo=True)
    person(p,1552,748,.48,RED);person(p,1591,741,.46,NAVY)
    p.use('bread',1460,728,83,60)
    person(p,775,886,.49,NAVY,lean=10);person(p,844,883,.49,RED,lean=9)
    for x,y,n,c in [(413,714,1,RED),(1063,703,2,GREEN),(1337,754,3,RED),(1020,915,4,GREEN)]:p.numbered(x,y,n,c,25)
    p.label(1100,798,'Le Scritture illuminano la Pasqua',fill=INK,size=17,anchor='middle')
    p.rect(80,1052,1760,277,GREEN,rx=8);p.label(110,1097,'Dalla pagina alla vita · Una proposta di 10 minuti',fill='#e1c88d',size=20)
    steps=[('LECTIO','3 min','Leggi il brano. Individua personaggi, domande e svolta.'),('MEDITATIO','2 min','Quale attesa o delusione desideri rileggere alla luce della fede?'),('ORATIO','2 min','Rispondi a Dio: ringrazia, chiedi aiuto o affida una persona.'),('CONTEMPLATIO','2 min','Rimani in silenzio. Accogli uno sguardo nuovo sulla tua giornata.'),('ACTIO','1 min','Scegli un gesto: oggi ascolta qualcuno prima di dare consigli.')]
    for i,(title,time,body) in enumerate(steps):
        x=110+i*347;p.circle(x+17,1144,15,'#ddc38a');p.text(x+17,1150,str(i+1),17,GREEN,weight='700',anchor='middle')
        p.text(x+47,1153,title,22,'#fff8e7',weight='600');p.text(x+47,1184,time,19,'#ddc38a');p.para(x,1222,body,310,23,fill='#eef0e2',leading=30)
        if i<4:p.path(f'M{x+285} 1143H{x+321}',stroke=GOLD,width=3,extra='marker-end="url(#arrow-gold)"')
    p.footer('Fonti: Lc 24,13–35; Benedetto XVI, Verbum Domini 87.','MAPPA NARRATIVA · LUOGHI E FIGURE SIMBOLICI');p.save('preview-cattolico-preghiera.svg')

if __name__=='__main__':
    faith();mass();emmaus()
    print('Generated three illustrated, referenced atlas plates at 1920 × 1440.')
