"""Read-only Pages facts and append-only release logs; never output credential values."""
import argparse
import json
import os
import subprocess
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
PROOF = ROOT / 'proof/2026-10-06_cdm_gallery_publish'
PROOF.mkdir(parents=True, exist_ok=True)
parser = argparse.ArgumentParser()
parser.add_argument('action', choices=['facts', 'log'])
parser.add_argument('--label', default='current')
parser.add_argument('--message', default='')
args = parser.parse_args()
now = datetime.now(timezone.utc).isoformat()
if args.action == 'log':
    sha = subprocess.check_output(['git', 'rev-parse', 'HEAD'], cwd=ROOT, text=True).strip()
    entry = f'\n\n## {now} — CDM gallery publication — {args.label}\n\n{args.message}\nCommit: {sha}. Evidence: {PROOF}.\n'
    for target in [Path('/Users/jkbrookspersonal/LocalSiteBuildFiles/00_GENERAL_BUILD_LOG.md'), ROOT/'00_BUILD_LOG.md', ROOT/'docs/BUILD_LOG.md', Path('/Users/jkbrookspersonal/JBLocalBuildLogs/00_GENERAL_BUILDLOG.md')]:
        with target.open('a') as stream:
            stream.write(entry)
    print(f'Logged {args.label}; HEAD {sha}')
else:
    base = 'https://api.cloudflare.com/client/v4/accounts/84f228323707bc1d08ba30d9f76146be/pages/projects/btf-production'
    def get(path):
        request = urllib.request.Request(base + path, headers={'Authorization': 'Bearer ' + os.environ['CF_PAGES_TOKEN']})
        with urllib.request.urlopen(request, timeout=30) as response:
            body = json.load(response)
        if not body['success']:
            raise RuntimeError('Cloudflare GET failed')
        return body['result']
    def deployment(value):
        return {key:value.get(key) for key in ['id','url','aliases','environment','created_on','latest_stage','deployment_trigger','stages']} if value else None
    project = get('')
    config = project.get('source', {}).get('config', {})
    facts = {'readAt':now, 'name':project['name'], 'production_branch':project.get('production_branch'), 'source':{'type':project.get('source', {}).get('type'), 'config':{key:config.get(key) for key in ['owner','repo_name','production_branch','preview_deployment_setting','production_deployments_enabled']}}, 'build_config':{key:project.get('build_config', {}).get(key) for key in ['build_command','destination_dir','root_dir']}, 'domains':project.get('domains'), 'canonical_deployment':deployment(project.get('canonical_deployment')), 'latest_deployment':deployment(project.get('latest_deployment'))}
    (PROOF / f'project-{args.label}.json').write_text(json.dumps(facts, indent=2)+'\n')
    deployments = [deployment(value) for value in get('/deployments?per_page=20')]
    (PROOF / f'deployments-{args.label}.json').write_text(json.dumps(deployments, indent=2)+'\n')
    print(json.dumps(facts, indent=2))
