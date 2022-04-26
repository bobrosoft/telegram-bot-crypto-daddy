#!/bin/bash

set -e

SCRIPT_PATH="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $SCRIPT_PATH

git pull
sudo systemctl restart telegram-bot-crypto-daddy
