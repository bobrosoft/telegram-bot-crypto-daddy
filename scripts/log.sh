#!/bin/bash
MESSAGES_COUNT=${1:-50}

journalctl -u telegram-bot-crypto-daddy -f -n $MESSAGES_COUNT -o cat
