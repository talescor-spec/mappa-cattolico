#!/bin/bash
set -euo pipefail

# One-time onboarding only. All project files, npm cache and temporary files
# stay on the user's existing external drive; existing projects are preserved.
if [ "$(uname -s)" != "Darwin" ]; then
  echo "Execute este preparo inicial no Mac com o HD externo conectado." >&2
  exit 1
fi

FIDEORA_HD=""
for FIDEORA_CANDIDATE in /Volumes/"THALES HD 500GB"*; do
  [ -d "$FIDEORA_CANDIDATE" ] || continue
  if [ -n "$FIDEORA_HD" ]; then
    echo "Há mais de um volume compatível. Confira o HD antes de continuar." >&2
    exit 1
  fi
  FIDEORA_HD="$FIDEORA_CANDIDATE"
done
if [ -z "$FIDEORA_HD" ] || [ ! -w "$FIDEORA_HD" ]; then
  echo "Conecte o HD THALES HD 500GB e confirme que permite gravação." >&2
  exit 1
fi
command -v git >/dev/null
command -v npm >/dev/null
node -e 'const n=Number(process.versions.node.split(".")[0]);process.exit(n===22||n===24?0:1)'

FIDEORA_STORAGE="$FIDEORA_HD/Fideora-Build"
mkdir -p "$FIDEORA_STORAGE/npm-cache" "$FIDEORA_STORAGE/tmp"
export TMPDIR="$FIDEORA_STORAGE/tmp/"
FIDEORA_CLOUD_PROJECT="$(mktemp -d "$FIDEORA_STORAGE/Xcode-Cloud.XXXXXX")"
git clone --depth 1 --single-branch --branch fideora-premium-v1 \
  https://github.com/talescor-spec/mappa-cattolico.git "$FIDEORA_CLOUD_PROJECT"
cd "$FIDEORA_CLOUD_PROJECT"
npm ci --cache "$FIDEORA_STORAGE/npm-cache" --no-audit --no-fund
npm run cap:ios
open ios/App/App.xcodeproj
printf '\nProjeto preparado: %s\n' "$FIDEORA_CLOUD_PROJECT"
printf '%s\n' 'No Xcode: Product → Xcode Cloud → Create Workflow.'
printf '%s\n' 'Use App/com.fideora.app, equipe CZ7QKZBQC8 e branch fideora-premium-v1.'
printf '%s\n' 'Esta etapa não faz Archive local, upload ou envio para App Review.'
