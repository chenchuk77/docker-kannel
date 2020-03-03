#!/bin/bash

function dps {
  docker ps --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}'
}
