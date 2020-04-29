docker-kannel
=============


kannelplus:2.1 image contains 
- bearerbox
- smsbox
- http server for send sms
- opensmppbox
all services wrapped in a starter script and runs within a single container

conf.json
- list of channels
- represents the system config
- each channel will create a container
- channel contains unique ports, usernames, msisdn

deploy.sh
  clear volumes fs struct
  generate fs struct
  generate docker starter script
  start dockers
undeploy.sh
  kill all kannel-xxx containers 
  clear volumes



## link to conf.json












Docker image for [Kannel](http://kannel.org/)







## kannelplus
Image that contains installation of kannel and opensmppbox.
To build the docker image:
$ docker built -t kannelplus .

## tailer
website that server realtime colored logs over http using nodejs.

## Usage ##
This docker image exposes a number of volumes that can be used for providing external access to the Kannel configuration file and logs.

## The hard way
Running seperate components (not recommended)

### Running bearerbox ###
`
docker run -d --name bearerbox -p 13000:13000 \
       --hostname bearerbox \
       --device=/dev/ttyUSB0 --cap-add SYS_PTRACE \
       --device=/dev/ttyUSB1 --cap-add SYS_PTRACE \
       --volume $(readlink -f volumes)/kannel/etc/:/etc/kannel \
       --volume $(readlink -f volumes)/kannel/log:/var/log/kannel \
       --volume $(readlink -f volumes)/kannel/spool:/var/spool/kannel \
         kannelplus bearerbox -v 0 /etc/kannel/kannel.conf
`
### Running smsbox ###
`
docker run -d --name smsbox -p 13013:13013 \
       --hostname smsbox --volumes-from bearerbox --link bearerbox:bearerbox \
         kannelplus smsbox -v 0 /etc/kannel/kannel.conf
`

### Running opensmppbox ###
`
docker run -d --name opensmppbox -p 2776:2776 \
       --hostname opensmppbox --volumes-from bearerbox --link bearerbox:bearerbox \
         kannelplus opensmppbox -v 0 /etc/kannel/opensmppbox.conf
`

### Running smpp-tester ###
`
docker run -d --name tester-bearerbox -p 14000:13000 \
       --hostname tester-bearerbox \
       --link opensmppbox:opensmppbox \
       --volume $(readlink -f volumes-tester)/kannel/etc/:/etc/kannel \
       --volume $(readlink -f volumes-tester)/kannel/log:/var/log/kannel \
       --volume $(readlink -f volumes-tester)/kannel/spool:/var/spool/kannel \
         kannelplus bearerbox -v 0 /etc/kannel/kannel.conf

docker run -d --name tester-smsbox -p 14013:13013 \
       --hostname tester-smsbox \
       --volumes-from tester-bearerbox \
       --link tester-bearerbox:tester-bearerbox \
       --link opensmppbox:opensmppbox \
         kannelplus smsbox -v 0 /etc/kannel/kannel.conf

`

## The easy way

### Running all from scratch
After deploying tailer, you should see realtime logs at http://192.168.2.113:8000
`
# to redeploy kannel (bearerbox, smsbox, opensmppbox):
./redeploy.sh

# to redeploy smpp tester (tester-bearerbox, tester-smsbox):
./tester-redeploy.sh

# to redeploy tailer:
cd tailer
./tailer-redeploy.sh

`


docker build -t kannelplus:2.1 .
