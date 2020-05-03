#!/bin/bash

#
# functions to be used in dev/testing, source this file in your ~/.bashrc
# or source it to the current shell by:
#
# $ source functions.sh
# 


function kannel-status {
  docker ps --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}'
}

function kannel-tree {
  tree volumes
  echo ""
}
