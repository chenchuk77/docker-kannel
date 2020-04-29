#!/usr/bin/python3
from jinja2 import Environment, FileSystemLoader
import json
import os
import stat

def makedir(dirname):
    try:
        os.makedirs(dirname)
    except FileExistsError:
        print(dirname + ": dirctory already exists, try ./undeploy.sh .")

def render(input_template, output_file, **kwargs):
    env = Environment(loader=FileSystemLoader('templates'))
    template = env.get_template(input_template)
    output_from_parsed_template = template.render(kwargs)
    #print(output_from_parsed_template)
    with open(output_file, "w") as out:
        out.write(output_from_parsed_template)

channels = {}
with open('conf.json') as json_file:
    data = json.load(json_file)
    channels = data['channels']

    print('generating executable deployment script ...')
    render('deploy.sh.j2', './deploy.sh', channels=channels)
    st = os.stat('./deploy.sh')
    os.chmod('./deploy.sh', st.st_mode | stat.S_IEXEC)

    print('create filesystem for each channel/container ...')
    for channel in channels:
        msisdn = channel['msisdn']
        makedir("./volumes/" + msisdn + "/kannel/etc")
        makedir("./volumes/" + msisdn + "/kannel/log")
        makedir("./volumes/" + msisdn + "/kannel/spool")
        print('generating config files for channel: {}.'.format(msisdn))
        render('kannel.conf.j2',       './volumes/'+msisdn+'/kannel/etc/kannel.conf',       channel=channel)
        render('opensmppbox.conf.j2',  './volumes/'+msisdn+'/kannel/etc/opensmppbox.conf',  channel=channel)
        render('opensmppbox.users.j2', './volumes/'+msisdn+'/kannel/etc/opensmppbox.users', channel=channel)

print ('done, u can run ./deploy.sh to start the containers.')

