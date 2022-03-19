#!/usr/bin/env python3
from config import Config
import subprocess
import os
import shlex

CLIENT_VERSION = '0.12'

def gen_certs():
    proc = subprocess.Popen(shlex.split('openssl req -x509 -newkey rsa:4096 -nodes -subj "/" -out redlure-cert.pem -keyout redlure-key.pem -days 365'))
    proc.wait()


def main():
    print(f'[*] redlure-client v{CLIENT_VERSION}')
    print('[*] Ensure this version is supported by your console (check console startup output)')
    # base ng command that will start the client
    cmd = f'ng serve --disable-host-check --host {Config.HOST} --port {Config.PORT}'

    # if SSL add ssl flag
    if Config.SSL:
        cmd += f' --ssl --ssl-cert {Config.CERT_PATH} --ssl-key {Config.KEY_PATH}'

        if Config.CERT_PATH == 'redlure-cert.pem' and Config.KEY_PATH == 'redlure-key.pem':
            # if not generated, run OpenSSL
            if not os.path.isfile('redlure-cert.pem') or not os.path.isfile('redlure-key.pem'):
                gen_certs()

        else:
            if not os.path.isfile(Config.CERT_PATH) or not os.path.isfile(Config.KEY_PATH):
                print('[!] CERT_PATH or KEY_PATH file does not exist')
                exit()

    try:
        # start the webserver    
        client = subprocess.Popen(shlex.split(cmd))
        client.wait()
    except KeyboardInterrupt:
        pass


if __name__ == '__main__':
    main()
            
