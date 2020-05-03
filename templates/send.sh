#!/bin/bash

#
# usage:
# ./send.sh {target} {qouted text}
#
# example:
# ./send.sh 0544434545 "web message from kannel-{{ channel.msisdn }}"
#

TO=$1
TEXT=$2

URL_TEXT=$(echo $TEXT | sed 's/ /%20/g')
curl -X GET "http://192.168.2.113:{{ channel.http_port }}/cgi-bin/sendsms?username=user&password=pass&from={{ channel.msisdn }}&to=${TO}&text=${URL_TEXT}"

