#!/bin/bash

TO=$1
TEXT=$2

URL_TEXT=$(echo $TEXT | sed 's/ /%20/g')
curl -X GET "http://192.168.2.113:15068/cgi-bin/sendsms?username=user&password=pass&from=972523245068&to=${TO}&text=${URL_TEXT}"

