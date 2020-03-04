#!/bin/bash


if [[ ! "$PWD" = "/home/smsc/chen/docker-kannel/tailer" ]]; then 
  echo "run only from: /home/smsc/chen/docker-kannel/tailer"
  exit 99
fi

docker stop tailer || true
docker rm tailer || true
docker build -t tailer:1.0 .

docker run -d --name tailer \
	   -p 8000:8000 \
           --volume $(readlink -f ../volumes)/kannel/log:/usr/src/app/log \
     	   -w /usr/src/app \
           tailer:1.0 node server.js log/smsc-gsm1.log


          # --volume $(readlink -f ../volumes)/kannel/log:/app/log \
