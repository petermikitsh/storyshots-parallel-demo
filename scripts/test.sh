#!/usr/bin/env bash

# Log Each command
set -x

if [[ $SKIP_BUILD -ne "1" ]]; then
  yarn build-storybook
fi

BASEDIR=$(dirname $0)
REPO_ROOT_DIR="$(dirname $( cd "$BASEDIR" ; pwd -P ))"
CURR_VERSION=$(node -p "require('${REPO_ROOT_DIR}/package.json').version")

CORES=$(getconf _NPROCESSORS_ONLN)
HALF_CORES=$(( ($CORES + (2 - 1)) / 2))

# Run test
npx --no-install jest 'stories/.*stories' --maxWorkers=$HALF_CORES

JEST_EXIT_CODE=$?

exit $JEST_EXIT_CODE
