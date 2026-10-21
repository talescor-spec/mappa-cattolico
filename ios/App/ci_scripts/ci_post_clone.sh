#!/bin/sh
set -eu

# Xcode Cloud runs this next to App.xcodeproj, before resolving Swift packages.
if [ "${CI_XCODE_CLOUD:-}" = "TRUE" ]; then
  if [ "${CI_TEAM_ID:-}" != "CZ7QKZBQC8" ]; then
    echo "Fideora: use Apple team CZ7QKZBQC8." >&2
    exit 1
  fi
  FIDEORA_BRANCH="${CI_BRANCH:-}"
  if [ -z "$FIDEORA_BRANCH" ]; then
    FIDEORA_BRANCH="${CI_GIT_REF:-}"
    FIDEORA_BRANCH="${FIDEORA_BRANCH#refs/heads/}"
  fi
  if [ "$FIDEORA_BRANCH" != "fideora-premium-v1" ]; then
    echo "Fideora: TestFlight builds must use fideora-premium-v1." >&2
    exit 1
  fi
fi

FIDEORA_REPO_ROOT="${CI_PRIMARY_REPOSITORY_PATH:-$(cd "$(dirname "$0")/../../.." && pwd)}"
cd "$FIDEORA_REPO_ROOT"
test -f package-lock.json
test -f ios/App/App.xcodeproj/project.pbxproj

if ! command -v node >/dev/null 2>&1 ||
  ! node -e 'const n=Number(process.versions.node.split(".")[0]);process.exit(n===22||n===24?0:1)'; then
  export HOMEBREW_NO_AUTO_UPDATE=1
  export HOMEBREW_NO_INSTALL_CLEANUP=1
  brew install node@22
  PATH="$(brew --prefix node@22)/bin:$PATH"
  export PATH
fi

node --version
npm ci --no-audit --no-fund
npm test
npm run appstore:preflight
npm run cap:ios

if [ "${CI_XCODE_CLOUD:-}" = "TRUE" ]; then
  test -f ios/App/App.xcodeproj/project.xcworkspace/xcshareddata/swiftpm/Package.resolved
fi

# Record what was prepared without logging credentials or environment contents.
echo "Fideora: dependencies, tests, preflight and bundled iOS assets ready."
