#!/bin/bash

set -e

SCRIPT_PATH="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $SCRIPT_PATH

runuser -u www -- git pull
systemctl restart telegram-bot-crypto-daddy
