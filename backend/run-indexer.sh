#!/bin/bash
cd /home/lora/repos/monadmon/backend
RPC_URL=http://127.0.0.1:8545 \
  MONSTER_NFT_ADDRESS=0xe7f1725e7734ce288f8367e1bb143e90bb3f0512 \
  BATTLE_ADDRESS=0xdc64a140aa3e981100a9beca4e685f962f0cf6c9 \
  PORT=3002 CONFIRMATIONS=0 POLL_INTERVAL_MS=1000 \
  DB_PATH=/tmp/monadmon-test.db \
  node dist/index.js
