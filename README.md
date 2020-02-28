docker-kannel
=============

Docker image for [Kannel](http://kannel.org/)

## kannelplus
Image that contains installation of kannel and opensmppbox.
To build the docker image:
$ docker built -t kannelplus .

## Usage ##
This docker image exposes a number of volumes that can be used for providing external access to the Kannel configuration file and logs.

### Running the bearerbox ###
`
# as daemon with opensmppbox support (local config in ./volumes instead of /opt)
docker run -d --name bearerbox -p 13000:13000 \
       --hostname bearerbox \
       --volume $(readlink -f volumes)/kannel/etc/:/etc/kannel \
       --volume $(readlink -f volumes)/kannel/log:/var/log/kannel \
       --volume $(readlink -f volumes)/kannel/spool:/var/spool/kannel \
         kannelplus bearerbox -v 0 /etc/kannel/kannel.conf
`

### Running the smsbox ###
`
# as daemon with opensmppbox support (local config in ./volumes instead of /opt)
docker run -d --name smsbox -p 13013:13013 \
       --hostname smsbox \
       --volumes-from bearerbox \
       --link bearerbox:bearerbox \
         kannelplus smsbox -v 0 /etc/kannel/kannel.conf
`

### Running the opensmppbox ###
`
# as daemon (local config in ./volumes instead of /opt)
docker run -d --name smppbox -p 2776:2776 \
       --hostname smppbox \
       --volumes-from bearerbox \
       --link bearerbox:bearerbox \
         kannelplus opensmppbox -v 0 /etc/kannel/kannel-smpp.conf
`


## Notes ##
For your smsbox to be able to connect with the bearerbox, you first need to link the bearerbox to the smsbox. Secondly, your configuration file needs to contain the hostname of the bearerbox. A container that has linked containers will contain hostnames that resolve to the ip address of the containers that are linked. In the example above, the hostname `bearerbox` will point to the ip address of the bearerbox container.

You also need to publish the ports you have defined in your `kannel.conf` if it will be accessible from the host.
