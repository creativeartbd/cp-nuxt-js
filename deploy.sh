#!/bin/bash
cd /Applications/MAMP/htdocs/cutoutpartner/v2/cutout-partner-frontend
rm -rf .output
npm run build
tar -czf nuxt-build.tar.gz .output/
scp nuxt-build.tar.gz root@76.13.155.121:/tmp/
ssh root@76.13.155.121 "cd /home/cutoutpartner/nuxt-app && mv .output .output-backup-\$(date +%Y%m%d-%H%M%S) && tar -xzf /tmp/nuxt-build.tar.gz && chown -R cutoutpartner:cutoutpartner .output && pm2 restart cutout-nuxt"