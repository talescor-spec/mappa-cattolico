# Internal helper: encode a specific tracked file chunk without printing secrets.
import sys,json,base64,subprocess
from pathlib import Path
if len(sys.argv)==1:
 base=sys.stdin.read().strip() or 'origin/fideora-premium-redesign'
 diff=subprocess.check_output(['git','diff','--name-status',base],text=True)
 print(json.dumps({'head':subprocess.check_output(['git','rev-parse','HEAD'],text=True).strip(),'base':subprocess.check_output(['git','rev-parse',base],text=True).strip(),'baseTree':subprocess.check_output(['git','rev-parse',base+'^{tree}'],text=True).strip(),'files':[{'status':line.split('\t')[0],'path':line.split('\t')[-1],'size':Path(line.split('\t')[-1]).stat().st_size if line[0]!='D' else 0}for line in diff.splitlines()]}))
else:
 file=Path(sys.argv[1]); assert file.resolve().is_relative_to(Path.cwd()); data=file.read_bytes()
 offset=int(sys.argv[2]); size=int(sys.argv[3]);print(base64.b64encode(data[offset:offset+size]).decode())
