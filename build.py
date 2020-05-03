#!/usr/bin/python3
from jinja2 import Environment, FileSystemLoader
import json
import os
import stat

def makeexec(filename):
    st = os.stat(filename)
    os.chmod(filename, st.st_mode | stat.S_IEXEC)

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

def render_tailer(input_template, output_file, **kwargs):
    env = Environment(loader=FileSystemLoader('templates/app'))
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
    makeexec('./deploy.sh')

    print('create filesystem for each channel/container ...')
    for channel in channels:
        msisdn = channel['msisdn']
        makedir("./volumes/" + msisdn + "/kannel/etc")
        makedir("./volumes/" + msisdn + "/kannel/log")
        makedir("./volumes/" + msisdn + "/kannel/spool")
        makedir("./volumes/" + msisdn + "/tailer/app")
        print('generating config files for channel: {}.'.format(msisdn))
        render('kannel.conf.j2',       './volumes/'+msisdn+'/kannel/etc/kannel.conf',       channel=channel)
        render('opensmppbox.conf.j2',  './volumes/'+msisdn+'/kannel/etc/opensmppbox.conf',  channel=channel)
        render('opensmppbox.users.j2', './volumes/'+msisdn+'/kannel/etc/opensmppbox.users', channel=channel)
        render('send.sh.j2', './volumes/'+msisdn+'/send.sh', channel=channel)
        makeexec('./volumes/'+msisdn+'/send.sh')
        render('show-logs.sh.j2', './volumes/'+msisdn+'/show-logs.sh', channel=channel)
        makeexec('./volumes/'+msisdn+'/show-logs.sh')
        # tailer deployment
        render_tailer('main.js.j2', './volumes/'+msisdn+'/tailer/app/main.js', channel=channel)
        render_tailer('server.js',  './volumes/'+msisdn+'/tailer/app/server.js', channel=channel)
        render_tailer('index.html', './volumes/'+msisdn+'/tailer/app/index.html', channel=channel)
        render_tailer('styles.css', './volumes/'+msisdn+'/tailer/app/styles.css', channel=channel)
print ('done, u can run ./deploy.sh to start the containers.')

