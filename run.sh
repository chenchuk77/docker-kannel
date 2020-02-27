#!/bin/bash

echo "removing old containers, press ^c to abort..."
sleep 3s
docker stop smsbox    || true
docker rm smsbox      || true
docker stop smppbox   || true
docker rm smppbox     || true
docker stop bearerbox || true
docker rm bearerbox   || true

echo "starting bearerbox..."
docker run -d --name bearerbox -p 13000:13000 --hostname bearerbox --volume /opt/kannel/etc/:/etc/kannel --volume /opt/kannel/log:/var/log/kannel --volume /opt/kannel/spool:/var/spool/kannel kannelplus bearerbox -v 0 /etc/kannel/kannel.conf

echo "starting smsbox..."
docker run -d --name smsbox -p 13013:13013 --hostname smsbox --volumes-from bearerbox --link bearerbox:bearerbox kannelplus smsbox -v 0 /etc/kannel/kannel.conf
echo "done."

echo "starting smppbox..."
docker run -d --name smppbox -p 2776:2776 --hostname smppbox --volumes-from bearerbox --link bearerbox:bearerbox kannelplus opensmppbox -v 0 /etc/kannel/kannel.conf
echo "done."

docker ps
echo "done."

