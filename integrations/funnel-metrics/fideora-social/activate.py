import sys,json,urllib.request,urllib.error
print('Ready',flush=True)
cfg=json.loads(sys.stdin.readline())
base='https://kgyqpedwgilotlwyhmnb.supabase.co/functions/v1/dashboard-daily-leads?studio=1&action='
def call(action,body):
 req=urllib.request.Request(base+action,data=json.dumps(body).encode(),headers={'Authorization':'Bearer '+cfg['dashboard_api_token'],'Content-Type':'application/json'})
 with urllib.request.urlopen(req,timeout=75) as r:
  data=json.loads(r.read().decode());assert data.get('ok'),data;return data
for slug in ['mdb-studio-libro-it','fideora-social-ios-it','fideora-social-android-it']:
 preview=call('sequence-confirm-preview',{'slug':slug,'category':'capture'})
 assert preview['count']==3,preview
 result=call('sequence-confirm-activate',{'slug':slug,'category':'capture','revision':preview['revision'],'confirm':'CONFIRMAR_E_ATIVAR','marketing_confirmation':True})
 assert result.get('active') is True,result
 print(json.dumps({'slug':slug,'active':True,'templates':result.get('count')}),flush=True)
