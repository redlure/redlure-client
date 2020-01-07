#!/usr/bin/env python3
from config import Config
import subprocess
import os
import shlex


def gen_certs():
    proc = subprocess.Popen(shlex.split('openssl req -x509 -newkey rsa:4096 -nodes -subj "/" -out redlure.crt -keyout redlure.key -days 365'))
    proc.wait()


def main():
    # base ng command that will start the client
    cmd = f'ng serve --host {Config.HOST} --port {Config.PORT}'

    # if SSL add ssl flag
    if Config.SSL:
        cmd += f' --ssl --ssl-cert {Config.CERT_PATH} --ssl-key {Config.KEY_PATH}'

        if Config.CERT_PATH == 'redlure.crt' and Config.KEY_PATH == 'redlure.key':
            # if not generated, run OpenSSL
            if not os.path.isfile('redlure.crt') or not os.path.isfile('redlure.key'):
                gen_certs()

        else:
            if not os.path.isfile(Config.CERT_PATH) or not os.path.isfile(Config.KEY_PATH):
                print('[!] CERT_PATH or KEY_PATH file does not exist')

    try:
        # start the webserver    
        client = subprocess.Popen(shlex.split(cmd))
        client.wait()
    except KeyboardInterrupt:
        pass


if __name__ == '__main__':
    main()
            
