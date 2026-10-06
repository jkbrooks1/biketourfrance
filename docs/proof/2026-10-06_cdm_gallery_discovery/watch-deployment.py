"""Watch the owner-approved Git-driven gallery release; never store secret configuration."""
import os, sys, json, time, urllib.request
from datetime import datetime, timezone
from pathlib import Path

expected = sys.argv[1]
proof = Path(__file__).resolve().parent
url = 'https://api.cloudflare.com/client/v4/accounts/84f228323707bc1d08ba30d9f76146be/pages/projects/btf-production'
previous = None
for attempt in range(120):
    req = urllib.request.Request(url, headers={'Authorization':'Bearer '+os.environ['CF_PAGES_TOKEN']})
    with urllib.request.urlopen(req, timeout=30) as response:
        data = json.load(response)
    assert data['success']
    p = data['result']
    assert p['production_branch'] == p['source']['config']['production_branch'] == 'main'
    def compact(d):
        return {k:d.get(k) for k in ['id','url','environment','latest_stage','deployment_trigger','stages']}
    latest = p.get('latest_deployment') or {}
    canonical = p.get('canonical_deployment') or {}
    state = {'readAt':datetime.now(timezone.utc).isoformat(),'name':p['name'],'production_branch':p['production_branch'],'sourceProductionBranch':p['source']['config']['production_branch'],'buildCommand':p['build_config']['build_command'],'output':p['build_config']['destination_dir'],'root':p['build_config']['root_dir'],'latest':compact(latest),'canonical':compact(canonical)}
    (proof/'deployment-current.json').write_text(json.dumps(state,indent=2)+'\n')
    metadata = latest.get('deployment_trigger',{}).get('metadata',{})
    key = (metadata.get('commit_hash'),latest.get('latest_stage',{}).get('name'),latest.get('latest_stage',{}).get('status'))
    if key != previous:
        print(json.dumps({'time':state['readAt'],'commit':key[0],'stage':key[1],'status':key[2]}),flush=True)
        previous = key
    target = canonical.get('deployment_trigger',{}).get('metadata',{}).get('commit_hash')
    if target == expected and canonical.get('latest_stage',{}).get('status') == 'success':
        (proof/'deployment-success.json').write_text(json.dumps(state,indent=2)+'\n')
        print('SUCCESS: '+canonical['url']+' commit '+expected,flush=True)
        raise SystemExit(0)
    if metadata.get('commit_hash') == expected and latest.get('latest_stage',{}).get('status') in ['failure','canceled']:
        raise SystemExit('Target deployment failed; inspect saved stage details.')
    time.sleep(10)
raise SystemExit('Deployment did not become canonical within 20 minutes; preserve evidence and inspect.')
