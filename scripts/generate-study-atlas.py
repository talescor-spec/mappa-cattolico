"""Original SVG atlas plates. Natural Earth geography, exact Italian typography.
Run from repo: python scripts/generate-study-atlas.py --source PATH
PATH: land.geojson, lakes.geojson, rivers.geojson, relief/SR_50M.tif.
Public-domain sources and cropped data are retained in scripts/study-map-data.
"""
import argparse,base64,json,math,textwrap
from html import escape
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'website/mappa-della-bibbia/assets'; DATA=ROOT/'scripts/study-map-data'
PAPER,INK,GOLD,MUTED,WATER='#faf6ec','#1c3d32','#ad8650','#6e7566','#d6e2dc'
def txt(x,y,value,size=16,fill=INK,serif=False,anchor='start',**kw):
 attrs=' '.join(f'{k.replace("_","-")}="{v}"' for k,v in kw.items())
 return f'<text x="{x}" y="{y}" font-family="'+('Georgia,serif' if serif else 'Arial,sans-serif')+f'" font-size="{size}" fill="{fill}" text-anchor="{anchor}" {attrs}>{escape(str(value))}</text>'
def para(x,y,value,width=46,size=15,leading=24,fill=MUTED):
 return ''.join(txt(x,y+i*leading,v,size,fill) for i,v in enumerate(textwrap.wrap(value,width)))
def rect(x,y,w,h,fill,**kw):
 attrs=' '.join(f'{k.replace("_","-")}="{v}"' for k,v in kw.items())
 return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" fill="{fill}" {attrs}/>'
def line(x1,y1,x2,y2,stroke=GOLD,width=1,**kw):
 attrs=' '.join(f'{k.replace("_","-")}="{v}"' for k,v in kw.items())
 return f'<path d="M{x1} {y1}L{x2} {y2}" stroke="{stroke}" stroke-width="{width}" fill="none" {attrs}/>'
def shell(title,category,n):
 return f'<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="960" viewBox="0 0 1280 960" role="img" aria-label="{escape(title)}"><title>{escape(title)}</title><defs><linearGradient id="paper"><stop stop-color="#fdfaf2"/><stop offset="1" stop-color="#f2ecdd"/></linearGradient></defs>'+rect(0,0,1280,960,'url(#paper)')+rect(22,22,1236,916,'none',stroke='#cbb891')+line(48,70,1232,70)+line(48,904,1232,904)+txt(50,52,'F I D E O R A',14,serif=True)+txt(1230,52,category,11,GOLD,anchor='end',letter_spacing='2')+txt(50,930,'MAPPA DELLA BIBBIA · EDIZIONE STUDIO CATTOLICA · ANTEPRIMA EDITORIALE',10,MUTED)+txt(1230,930,n,13,GOLD,anchor='end')
def clip(poly,bounds):
 a,b,c,d=bounds;out=poly
 for axis,val,greater in [(0,a,True),(0,c,False),(1,b,True),(1,d,False)]:
  result=[]
  if not out:break
  prev=out[-1];pin=(prev[axis]>=val if greater else prev[axis]<=val)
  for cur in out:
   cin=(cur[axis]>=val if greater else cur[axis]<=val)
   if cin!=pin:
    t=(val-prev[axis])/(cur[axis]-prev[axis]);result.append([prev[0]+t*(cur[0]-prev[0]),prev[1]+t*(cur[1]-prev[1])])
   if cin:result.append(cur)
   prev,pin=cur,cin
  out=result
 return out
def build_sources(source):
 from PIL import Image,ImageOps,ImageFilter
 DATA.mkdir(parents=True,exist_ok=True);bounds=(24,29.8,38,40.5)
 for name in ['land','lakes','rivers']:
  original=json.loads((source/f'{name}.geojson').read_text());output=[]
  for f in original['features']:
   g=f['geometry'];typ=g['type'];coords=g['coordinates']
   if typ in ['Polygon','MultiPolygon']:
    rings=[]
    for p in ([coords] if typ=='Polygon' else coords):
     r=clip(p[0],bounds)
     if len(r)>3:rings.append([[round(x,5),round(y,5)] for x,y,*_ in r])
    if rings:output.append({'name':f['properties'].get('name'),'polys':rings})
   elif name=='rivers' and f['properties'].get('name')=='Jordan':
    output.append({'name':'Jordan','lines':[coords] if typ=='LineString' else coords})
  (DATA/f'{name}.json').write_text(json.dumps(output,separators=(',',':')))
 im=Image.open(source/'relief/SR_50M.tif')
 for key,b in [('levant',(33.0,30.7,37.4,33.8)),('paul',(26.0,33.4,37.3,39.3))]:
  lo,la,hi,ha=b;w,h=im.size
  crop=im.crop(((lo+180)/360*w,(90-ha)/180*h,(hi+180)/360*w,(90-la)/180*h))
  crop=ImageOps.colorize(crop.convert('L'),black='#7c8164',white='#f1e8d2').filter(ImageFilter.GaussianBlur(.3))
  crop.save(DATA/f'{key}-relief.webp',quality=86)
 (DATA/'SOURCES.md').write_text('''# Cartographic source\n\nCropped Natural Earth 1:10m land, lakes and Jordan river vectors:\nhttps://github.com/nvkelso/natural-earth-vector/tree/master/geojson\n\nNatural Earth 1:50m SRTM-derived shaded relief, cropped and tinted:\nhttps://www.naturalearthdata.com/downloads/50m-raster-data/50m-shaded-relief/\nhttps://naciscdn.org/naturalearth/50m/raster/SR_50M.zip\n\nPublic domain: https://www.naturalearthdata.com/about/terms-of-use/\nModern geography is an orientation base, not ancient borders or exact itineraries.\nCities and route connections are indicative.\n\nBiblical references: Lk 1–2; 4; 9,51; 19–24; Acts 13–14. Original commentary.\nPaul journey checked against Acts 13–14 (CEI/Vatican) and Benedict XVI,\nGeneral Audience 27 August 2008. No copyrighted translation is reproduced.\nDesign references: DK The Bible Atlas; Zondervan Atlas of the Bible.\nOriginal composition: no source pages, maps, art or trade dress copied.\n''')
class Map:
 def __init__(self,key,bounds,x,y,w,h):self.key,self.b,self.x,self.y,self.w,self.h=key,bounds,x,y,w,h
 def p(self,lon,lat):
  a,b,c,d=self.b;return round(self.x+(lon-a)/(c-a)*self.w,2),round(self.y+(d-lat)/(d-b)*self.h,2)
 def path(self,points,close=False):return 'M'+'L'.join(f'{x} {y}' for x,y in [self.p(*p[:2]) for p in points])+('Z' if close else '')
 def base(self):
  x,y,w,h=self.x,self.y,self.w,self.h;key=self.key
  land=json.loads((DATA/'land.json').read_text());lakes=json.loads((DATA/'lakes.json').read_text())
  rings=[clip(p,self.b) for f in land for p in f['polys']];d=''.join(self.path(p,True) for p in rings if len(p)>3)
  relief=base64.b64encode((DATA/f'{key}-relief.webp').read_bytes()).decode()
  s=f'<defs><clipPath id="box-{key}">'+rect(x,y,w,h,'white')+f'</clipPath><clipPath id="land-{key}"><path d="{d}"/></clipPath></defs>'
  s+=f'<g clip-path="url(#box-{key})">'+rect(x,y,w,h,WATER)+f'<path d="{d}" fill="#ede6d2" stroke="#b6bcaa" stroke-width="1.1"/>'
  s+=f'<image x="{x}" y="{y}" width="{w}" height="{h}" preserveAspectRatio="none" href="data:image/webp;base64,{relief}" clip-path="url(#land-{key})" opacity=".88"/>'
  for lon in range(math.ceil(self.b[0]),math.ceil(self.b[2])):
   a,b=self.p(lon,self.b[1]);c,d=self.p(lon,self.b[3]);s+=line(a,b,c,d,'#7b9985',.45,opacity='.35')
  for lat in range(math.ceil(self.b[1]),math.ceil(self.b[3])):
   a,b=self.p(self.b[0],lat);c,d=self.p(self.b[2],lat);s+=line(a,b,c,d,'#7b9985',.45,opacity='.35')
  for f in lakes:
   for p in f['polys']:
    pp=clip(p,self.b)
    if len(pp)>3:s+=f'<path d="{self.path(pp,True)}" fill="{WATER}" stroke="#93aa9e" stroke-width="1"/>'
  if key=='levant':
   for f in json.loads((DATA/'rivers.json').read_text()):
    for p in f.get('lines',[]):s+=f'<path d="{self.path(p)}" fill="none" stroke="#769c95" stroke-width="1.6"/>'
  return s+'</g>'+rect(x,y,w,h,'none',stroke='#b8b79f',stroke_width='.8')
 def city(self,lon,lat,label,dx=10,dy=-10,ref=None,anchor='start'):
  x,y=self.p(lon,lat);s=f'<circle cx="{x}" cy="{y}" r="4.2" fill="{INK}" stroke="{PAPER}" stroke-width="1.5"/>'
  s+=txt(x+dx,y+dy,label,14,PAPER,True,anchor,stroke=PAPER,stroke_width='3',stroke_linejoin='round')+txt(x+dx,y+dy,label,14,INK,True,anchor)
  if ref:s+=txt(x+dx,y+dy+16,ref,10,PAPER,anchor=anchor,stroke=PAPER,stroke_width='2')+txt(x+dx,y+dy+16,ref,10,MUTED,anchor=anchor)
  return s
 def label(self,lon,lat,value,size=16,fill=MUTED,**kw):return txt(*self.p(lon,lat),value,size,fill,**kw)
 def route(self,points):return f'<path d="{self.path(points)}" fill="none" stroke="{PAPER}" stroke-width="6"/><path d="{self.path(points)}" fill="none" stroke="#a2573f" stroke-width="2.7" stroke-dasharray="7 5"/>'
def compass(x,y):return f'<g transform="translate({x},{y})"><circle r="23" fill="{PAPER}" fill-opacity=".75" stroke="#c8b58e"/><path d="M0-19L6 11L0 6L-6 11Z" fill="{INK}"/><path d="M0-19V6" stroke="#c2a776"/>'+txt(0,-31,'N',10,anchor='middle')+'</g>'
def save(name,s):(OUT/name).write_text(s+'</svg>')
def generate():
 s=shell('La terra dei Vangeli','ATLANTE · LUOGHI E RACCONTI','024')
 s+=txt(50,112,'01 / ORIENTARSI NEL RACCONTO',11,GOLD,letter_spacing='2')+txt(48,170,'La terra dei Vangeli',48,serif=True)+txt(50,204,'Una geografia da leggere insieme alle Scritture.',18,MUTED,serif=True,font_style='italic')
 m=Map('levant',(33.0,30.7,37.4,33.8),50,239,735,620);s+=m.base()
 for lon,lat,label,dx,dy,ref in [(35.299,32.701,'Nazaret',-12,-12,'Lc 1–2'),(35.575,32.881,'Cafarnao',15,-9,'Lc 4,31'),(35.213,31.778,'Gerusalemme',-13,-12,'Lc 19–24'),(35.202,31.705,'Betlemme',-13,24,'Lc 2'),(35.443,31.861,'Gerico',15,-5,'Lc 19,1'),(34.891,32.500,'Cesarea',-13,-8,None)]:s+=m.city(lon,lat,label,dx,dy,ref,'end' if dx<0 else 'start')
 for lon,lat,label in [(35.01,33.2,'GALILEA'),(34.9,32.13,'SAMARIA'),(34.85,31.34,'GIUDEA'),(36.1,32.55,'DECAPOLI')]:s+=m.label(lon,lat,label,16,'#8b815f',anchor='middle',letter_spacing='3')
 s+=m.label(34.15,32.8,'MAR',16,'#678f86',serif=True,font_style='italic')+m.label(34.02,32.66,'MEDITERRANEO',16,'#678f86',serif=True,font_style='italic')+m.label(35.72,32.76,'Lago di Galilea',12,'#527e73',serif=True,font_style='italic')+m.label(35.64,31.45,'Mar Morto',13,'#527e73',serif=True,font_style='italic')+m.label(35.73,32.27,'Giordano',12,'#527e73',serif=True,font_style='italic')+compass(737,290)
 x,y=m.p(33.3,30.94);bar=round(40/(111.32*math.cos(math.radians(30.94)))*735/4.4);s+=line(x,y,x+bar,y,INK,2)+line(x,y-5,x,y+5,INK)+line(x+bar,y-5,x+bar,y+5,INK)+txt(x,y-12,'0',10)+txt(x+bar,y-12,'40 km',10,anchor='end')
 s+=txt(830,260,'DAL LUOGO AL SIGNIFICATO',11,GOLD,letter_spacing='1.2')
 steps=[('I','Gli inizi','Nazaret e Betlemme','Le origini, le promesse, l’inizio del racconto.','Lc 1–2'),('II','La Galilea','Cafarnao e il lago','Incontri, insegnamenti e vita quotidiana.','Lc 4–9'),('III','Il cammino','Verso Gerusalemme','Il viaggio diventa una chiave di lettura.','Lc 9,51'),('IV','Gerusalemme','Passione e risurrezione','Il racconto converge nella città santa.','Lc 19–24')]
 for i,(n,h,sub,body,ref) in enumerate(steps):
  yy=300+i*137;s+=line(849,yy+12,849,yy+122,'#c4b58e')+f'<circle cx="849" cy="{yy}" r="17" fill="{INK}"/>'+txt(849,yy+5,n,13,PAPER,True,'middle')+txt(879,yy+4,h,27,serif=True)+txt(879,yy+30,sub,12,GOLD)+para(879,yy+58,body,38,13,20)+txt(879,yy+104,ref,11,GOLD)
 s+=txt(830,883,'Leggi i luoghi. Ritrova il filo della storia.',16,serif=True,font_style='italic')+txt(50,884,'Base moderna: Natural Earth · Luoghi antichi indicativi · Nessun confine politico ricostruito.',10,MUTED)
 save('preview-terra-vangeli.svg',s)
 s=shell('Il primo viaggio di Paolo','ATLANTE · LE PRIME COMUNITÀ','086')
 s+=txt(50,112,'02 / SEGUIRE UN PERCORSO',11,GOLD,letter_spacing='2')+txt(48,170,'Il primo viaggio di Paolo',48,serif=True)+txt(50,204,'Da Antiochia alle comunità dell’Asia Minore · Atti 13–14',18,MUTED,serif=True,font_style='italic')
 m=Map('paul',(26.0,33.4,37.3,39.3),50,240,850,548);s+=m.base()
 s+=m.route([(36.16,36.20),(35.92,36.12),(33.91,35.18),(32.41,34.76),(30.85,36.96),(31.19,38.31),(32.49,37.87),(32.36,37.58),(33.19,37.35)])
 for lon,lat,name,dx,dy in [(36.16,36.20,'Antiochia',12,-13),(35.92,36.12,'Seleucia',-13,21),(33.91,35.18,'Salamina',13,-7),(32.41,34.76,'Pafo',-13,22),(30.85,36.96,'Perge',-12,-10),(31.19,38.31,'Antiochia di Pisidia',-12,-10),(32.49,37.87,'Iconio',12,-12),(32.36,37.58,'Listra',-12,23),(33.19,37.35,'Derbe',12,18),(30.70,36.88,'Attalia',-12,24)]:s+=m.city(lon,lat,name,dx,dy,anchor='end' if dx<0 else 'start')
 for lon,lat,label in [(32,39.0,'ASIA MINORE'),(32.8,35.5,'CIPRO'),(36.7,37.4,'SIRIA')]:s+=m.label(lon,lat,label,16,'#807858',anchor='middle',letter_spacing='2')
 s+=m.label(30.4,34.35,'M A R   M E D I T E R R A N E O',16,'#5d8579',serif=True,font_style='italic')+compass(844,290)+txt(940,260,'IL FILO DEGLI ATTI',11,GOLD,letter_spacing='1')
 for yy,n,title,body,ref in [(310,'01','L’invio','La comunità di Antiochia invia Barnaba e Saulo.','At 13,1–3'),(445,'02','Cipro','Da Salamina a Pafo: il Vangelo attraversa l’isola.','At 13,4–12'),(580,'03','L’Asia Minore','Da Perge alle comunità di Iconio, Listra e Derbe.','At 13,13–14,21')]:s+=txt(940,yy,n,13,GOLD)+txt(978,yy,title,27,serif=True)+para(940,yy+31,body,31,14,23)+txt(940,yy+99,ref,11,GOLD)+line(940,yy+113,1228,yy+113,'#d5c5a6')
 s+=rect(50,815,1178,63,INK)+txt(72,840,'IL RITORNO',10,'#d1b57f',letter_spacing='1')+txt(72,862,'Le comunità vengono rivisitate e incoraggiate. Il viaggio si conclude ad Antiochia (At 14,21–28).',15,PAPER,serif=True)+line(53,801,90,801,'#a2573f',2.7,stroke_dasharray='7 5')+txt(102,805,'Collegamenti indicativi, non tracciati esatti · Base geografica moderna: Natural Earth',10,MUTED)
 save('preview-viaggi-paolo.svg',s)
 s=shell('La mappa dei 73 libri','MAPPE DI STUDIO · IL CANONE CATTOLICO','012')
 s+=txt(50,112,'03 / VEDERE L’INSIEME',11,GOLD,letter_spacing='2')+txt(48,170,'Una biblioteca, una sola storia',46,serif=True)+txt(50,205,'Riconosci le parti. Collega i libri. Ritrova il posto di ogni pagina.',18,MUTED,serif=True,font_style='italic')
 s+=rect(50,240,576,82,INK)+rect(650,240,578,82,'#879277')+txt(75,293,'46',49,PAPER,True)+txt(160,275,'ANTICO TESTAMENTO',13,PAPER,letter_spacing='1.5')+txt(160,302,'Promessa, alleanza e attesa',18,'#d8ddc6',True,font_style='italic')+txt(676,293,'27',49,PAPER,True)+txt(760,275,'NUOVO TESTAMENTO',13,PAPER,letter_spacing='1.5')+txt(760,302,'Cristo e la Chiesa delle origini',18,PAPER,True,font_style='italic')
 groups=[(50,352,576,'PENTATEUCO','5',['Genesi','Esodo','Levitico','Numeri','Deuteronomio'],5,'#d7d6bc'),(50,453,576,'LIBRI STORICI','16',['Giosuè','Giudici','Rut','1 Samuele','2 Samuele','1 Re','2 Re','1 Cronache','2 Cronache','Esdra','Neemia','Tobia','Giuditta','Ester','1 Maccabei','2 Maccabei'],6,'#e3d5b8'),(50,625,576,'POETICI E SAPIENZIALI','7',['Giobbe','Salmi','Proverbi','Qoèlet','Cantico','Sapienza','Siracide'],4,'#ccd6c8'),(50,750,576,'LIBRI PROFETICI','18',['Isaia','Geremia','Lamentaz.','Baruc','Ezechiele','Daniele','Osea','Gioele','Amos','Abdia','Giona','Michea','Naum','Abacuc','Sofonia','Aggeo','Zaccaria','Malachia'],6,'#e1cbbd'),(650,352,578,'VANGELI E ATTI','5',['Matteo','Marco','Luca','Giovanni','Atti'],5,'#c6d4ca'),(650,453,578,'LETTERE','21',['Romani','1 Corinzi','2 Corinzi','Galati','Efesini','Filippesi','Colossesi','1 Tessal.','2 Tessal.','1 Timoteo','2 Timoteo','Tito','Filemone','Ebrei','Giacomo','1 Pietro','2 Pietro','1 Giovanni','2 Giovanni','3 Giovanni','Giuda'],5,'#d6d6c0'),(650,697,578,'APOCALISSE','1',['Apocalisse'],1,'#e3d0b7')]
 for x,y,w,title,count,books,cols,color in groups:
  s+=txt(x,y,title,11,GOLD,letter_spacing='1')+txt(x+w,y,count+' LIBRI' if count!='1' else '1 LIBRO',10,MUTED,anchor='end');gap=6;cw=(w-gap*(cols-1))/cols
  for i,b in enumerate(books):
   xx=x+(i%cols)*(cw+gap);yy=y+16+(i//cols)*36;s+=rect(xx,yy,cw,30,color,rx='2')+txt(xx+cw/2,yy+20,b,11,INK,anchor='middle')
 s+=rect(650,785,578,82,'#eee7d7')+txt(670,810,'UN FILO DA SEGUIRE',10,GOLD,letter_spacing='1.2')+txt(670,839,'Promessa',18,serif=True)+txt(790,839,'→',18,GOLD)+txt(824,839,'Compimento',18,serif=True)+txt(973,839,'→',18,GOLD)+txt(1008,839,'Testimonianza',18,serif=True)+txt(50,889,'Classificazione di studio del canone cattolico · Nomi abbreviati per facilitare la consultazione.',10,MUTED)
 save('preview-mappa-73-libri.svg',s)
 print('Generated 3 atlas plates: 2 real geographic maps and a 73-book Catholic visual index.')
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--source',type=Path);a=p.parse_args()
 if a.source:build_sources(a.source)
 generate()
