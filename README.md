docker-kannel
=============

Docker image for [Kannel](http://kannel.org/)

## kannelplus
Image that contains installation of kannel and opensmppbox.
To build the docker image:
$ docker built -t kannelplus .

## Usage ##
This docker image exposes a number of volumes that can be used for providing external access to the Kannel configuration file and logs.

### Running bearerbox ###
`
docker run -d --name bearerbox -p 13000:13000 \
       --hostname bearerbox \
       --device=/dev/ttyUSB0 --cap-add SYS_PTRACE \
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

