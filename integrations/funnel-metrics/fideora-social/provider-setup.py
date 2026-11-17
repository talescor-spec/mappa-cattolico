import sys,json,urllib.request,urllib.error
print("Ready",flush=True)
cfg=json.loads(sys.stdin.readline())
def call(path,body=None,method=None):
 data=json.dumps(body).encode() if body is not None else None
 req=urllib.request.Request("https://api.brevo.com/v3"+path,data=data,headers={"api-key":cfg["brevo_api_key"],"accept":"application/json","content-type":"application/json"},method=method or ("POST" if data else "GET"))
 with urllib.request.urlopen(req,timeout=25) as res:
  text=res.read().decode();return json.loads(text) if text else {}
lists=[]
for offset in range(0,1000,50):
 rows=call("/contacts/lists?limit=50&offset="+str(offset))["lists"];lists.extend(rows)
 if len(rows)<50:break
names={"book":"Captura MDB Studio IT - Livro","ios":"Captura Fideora Social IT - iOS","android":"Captura Fideora Social IT - Android","book_buyers":"Compradores MDB Studio IT","app_buyers":"Assinantes Fideora Social IT"}
result={}
for kind,name in names.items():
 matches=[row for row in lists if row["name"]==name]
 if len(matches)>1:raise RuntimeError("Ambiguous list: "+name)
 row=matches[0] if matches else call("/contacts/lists",{"name":name,"folderId":1})
 result[kind]={"id":row["id"],"name":name}
attrs=call("/contacts/attributes").get("attributes",[])
for name in ["FIDEORA_SOCIAL_OFFER","FIDEORA_SOCIAL_PLATFORM","FIDEORA_SOCIAL_SOURCE","FIDEORA_SOCIAL_JOURNEY"]:
 if not any(a["name"]==name for a in attrs):call("/contacts/attributes/normal/"+name,{"type":"text"})
senders=[{k:s.get(k) for k in ["name","email","active"]} for s in call("/senders").get("senders",[])]
print(json.dumps({"lists":result,"senders":senders}),flush=True)
