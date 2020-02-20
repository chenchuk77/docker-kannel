#!/bin/bash

echo "removing old containers, press ^c to abort..."
sleep 3s
docker stop smsbox    || true
docker rm smsbox      || true
docker stop bearerbox || true
docker rm bearerbox   || true

echo "starting bearerbox..."
docker run -d --name bearerbox --hostname bearerbox --volume /opt/kannel/etc/:/etc/kannel --volume /opt/kannel/log:/var/log/kannel --volume /opt/kannel/spool:/var/spool/kannel kannel bearerbox -v 0 /etc/kannel/kannel.conf

echo "starting smsbox..."
docker run -d --name smsbox --hostname smsbox --volumes-from bearerbox --link bearerbox:bearerbox kannel smsbox -v 0 /etc/kannel/kannel.conf
echo "done."


docker ps
echo "done."

