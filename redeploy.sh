#!/bin/bash

echo "removing old containers, press ^c to abort..."
sleep 1s
docker stop smsbox      || true
docker rm smsbox        || true
docker stop opensmppbox || true
docker rm opensmppbox   || true
docker stop bearerbox   || true
docker rm bearerbox     || true


################ IN EDIT ##################

echo "starting kannel-combined"
docker run -d --name kannel-xxx \
	   -p 13000:13000 \
	   -p 13013:13013 \
	   -p 2776:2776 \
	   --device=/dev/ttyUSB0 --cap-add SYS_PTRACE \
           --volume $(readlink -f volumes)/kannel/etc/:/etc/kannel \
           --volume $(readlink -f volumes)/kannel/log:/var/log/kannel \
           --volume $(readlink -f volumes)/kannel/spool:/var/spool/kannel \
           kannelplus:2.1

# --device=/dev/ttyUSB1 --cap-add SYS_PTRACE \

echo "kannel started."
docker ps --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}'
echo "done."

