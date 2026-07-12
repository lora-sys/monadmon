#!/bin/bash
cd /home/lora/repos/monadmon
exec node scripts/generate-monsters.mjs --variants=false > /tmp/pollinations.log 2>&1
