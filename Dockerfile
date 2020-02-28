FROM ubuntu:precise

#
# kannelplus image, contains kannel + opensmppbox
#
# TODO: bearerbox fail due to unknown group in config (opensmppbox)
# this is probably because kannel-dev should be used when using opensmppbox
#

MAINTAINER Chen Alkabets <chenchuk@gmail.com>

RUN apt-get update && apt-get install -y \
    bison \
    build-essential \
    libxml2-dev \
    libssl-dev \
    openssl \
    wget \
    && wget --no-check-certificate https://kannel.org/download/1.4.5/gateway-1.4.5.tar.gz \
    && tar xzf gateway-1.4.5.tar.gz \
    && cd gateway-1.4.5 \
    && ./configure --prefix=/usr --sysconfdir=/etc/kannel \
    && touch .depend \
    && make \
    && make install \
    && cp test/fakesmsc /usr/sbin/ \
    && cp test/fakewap /usr/sbin/ \
    && cd / \
    && rm gateway-1.4.5.tar.gz \
    && rm -Rf gateway-1.4.5 \
    && mkdir -p /var/log/kannel \
    && mkdir -p /var/spool/kannel

# installing opensmppbox
RUN cd /tmp \
    && apt-get install -y subversion \
    && svn co https://svn.kannel.org/opensmppbox/trunk \
    && cd trunk \
    && ./configure \
    && make \
    && make install \
    && ln -s /usr/local/sbin/opensmppbox \
             /usr/sbin/opensmppbox

# install kannel-dev
RUN apt-get install -y kannel-dev

VOLUME /etc/kannel
VOLUME /var/log/kannel
VOLUME /var/spool/kannel
WORKDIR /usr/sbin

# admin-port, send-sms-port, smpp-port
EXPOSE 13000 13013 2776
