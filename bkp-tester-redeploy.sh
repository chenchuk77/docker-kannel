#!/bin/bash

echo "removing old tester containers, press ^c to abort..."
sleep 1s
docker stop tester-smsbox      || true
docker rm tester-smsbox        || true
docker stop tester-bearerbox   || true
docker rm tester-bearerbox     || true

echo "starting tester-bearerbox..."
docker run -d --name tester-bearerbox -p 14000:13000 \
       --hostname tester-bearerbox \
       --link opensmppbox:opensmppbox \
       --volume $(readlink -f volumes-tester)/kannel/etc/:/etc/kannel \
       --volume $(readlink -f volumes-tester)/kannel/log:/var/log/kannel \
       --volume $(readlink -f volumes-tester)/kannel/spool:/var/spool/kannel \
         kannelplus bearerbox -v 0 /etc/kannel/kannel.conf

echo "waiting for tester-bearerbox..."; sleep 3s

echo "starting tester-smsbox..."
docker run -d --name tester-smsbox -p 14013:13013 \
       --hostname tester-smsbox \
       --volumes-from tester-bearerbox \
       --link tester-bearerbox:tester-bearerbox \
       --link opensmppbox:opensmppbox \
         kannelplus smsbox -v 0 /etc/kannel/kannel.conf

echo "tester started."
docker ps --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}'
echo "done."

