#!/bin/bash

set -e

SCRIPT_PATH="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_PATH"
cd ..

git restore .
git pull
docker compose up --build -d
./scripts/log.sh 1
