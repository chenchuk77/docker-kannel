#!/bin/bash

echo "removing running containers..."
for cid in $(docker ps | grep kannel | cut -d " " -f1); do
  docker stop $cid || true
  docker rm $cid || true
done

echo "removing deployment script"
rm deploy.sh || true

echo "removing deployment fs structure"
rm -rf volumes/97252*

echo "checking deployed volumes"
tree volumes

echo "done, u may run ./build.py to create a new deployment."


