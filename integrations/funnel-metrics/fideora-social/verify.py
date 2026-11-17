import sys,json,urllib.request,urllib.error,uuid
print('Ready',flush=True)
cfg=json.loads(sys.stdin.readline())
base='https://kgyqpedwgilotlwyhmnb.supabase.co/functions/v1/dashboard-daily-leads'
def call(query,body=None,token=None):
 headers={'Content-Type':'application/json'}
 if token:headers['Authorization']='Bearer '+token
 req=urllib.request.Request(base+query,data=json.dumps(body).encode() if body is not None else None,headers=headers)
 try:
  with urllib.request.urlopen(req,timeout=55) as r:return r.status,json.loads(r.read().decode())
 except urllib.error.HTTPError as e:return e.code,json.loads(e.read().decode())
status,health=call('?social=1&action=health');assert status==200 and health['ok'],(status,health)
session=str(uuid.uuid4());fake='qa.fideora.social.20261117.31415@example.com';captures=[]
for offer,platform in [('book','desktop'),('apple','ios'),('android','android')]:
 status,data=call('?social=1&action=capture',dict(name='Giulia Rossi',email=fake,offer=offer,platform=platform,session_id=session,attribution={'utm_source':'qa','utm_medium':'internal_test','utm_campaign':'social_launch_20261117'},followup_requested=True,is_test=True))
 assert status==200 and data.get('ok'),(status,data)
 captures.append(data)
 print(json.dumps({'capture':offer,'status':status,'funnel':data['funnel'],'list':data['listId']}),flush=True)
event=dict(id=str(uuid.uuid4()),session_id=session,event_name='page_view',platform='ios',attribution={'utm_source':'qa','utm_campaign':'social_launch_20261117'},is_test=True)
status,data=call('?social=1&action=collect',event);assert status==200 and data.get('ok'),(status,data)
status,data=call('?social=1&action=collect',dict(event,event_name='subscription_started'));assert status==400,(status,data)
print(json.dumps({'websiteEvent':True,'clientPurchaseForgeryBlocked':True}),flush=True)
status,data=call('?social=1&action=report',{'days':30},cfg['dashboard_api_token']);assert status==200 and data.get('ok'),(status,data)
print(json.dumps({'report':True,'captures':captures,'session':session,'testEmail':fake}),flush=True)
