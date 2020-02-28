#!/bin/bash

echo "removing old containers, press ^c to abort..."
sleep 3s
docker stop smsbox      || true
docker rm smsbox        || true
docker stop opensmppbox || true
docker rm opensmppbox   || true
docker stop bearerbox   || true
docker rm bearerbox     || true

echo "starting bearerbox..."
docker run -d --name bearerbox -p 13000:13000 \
       --hostname bearerbox \
       --device=/dev/ttyUSB0 --cap-add SYS_PTRACE \
       --volume $(readlink -f volumes)/kannel/etc/:/etc/kannel \
       --volume $(readlink -f volumes)/kannel/log:/var/log/kannel \
       --volume $(readlink -f volumes)/kannel/spool:/var/spool/kannel \
         kannelplus bearerbox -v 0 /etc/kannel/kannel.conf

#docker run -d --name bearerbox -p 13000:13000 \
#       --hostname bearerbox \
#       --volume $(readlink -f volumes)/kannel/etc/:/etc/kannel \
#       --volume $(readlink -f volumes)/kannel/log:/var/log/kannel \
#       --volume $(readlink -f volumes)/kannel/spool:/var/spool/kannel \
#         kannelplus bearerbox -v 0 /etc/kannel/kannel.conf
echo "waiting for bearerbox..."; sleep 3s

echo "starting smsbox..."
docker run -d --name smsbox -p 13013:13013 \
       --hostname smsbox --volumes-from bearerbox --link bearerbox:bearerbox \
         kannelplus smsbox -v 0 /etc/kannel/kannel.conf

echo "starting opensmppbox..."
docker run -d --name opensmppbox -p 2776:2776 \
       --hostname opensmppbox --volumes-from bearerbox --link bearerbox:bearerbox \
         kannelplus opensmppbox -v 0 /etc/kannel/opensmppbox.conf

echo "kannel started."

docker ps
echo "done."

