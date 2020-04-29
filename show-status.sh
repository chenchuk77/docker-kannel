#!/bin/bash

echo "volumes structure:"
tree volumes

echo "containers status:"
docker ps --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}'
