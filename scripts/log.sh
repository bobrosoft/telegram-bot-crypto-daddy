#!/bin/bash
MESSAGES_COUNT=${1:-50}

docker logs telegram-bot-crypto-daddy -n $MESSAGES_COUNT --follow
