#!/bin/bash

sudo apt-get install -y software-properties-common
curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -
sudo apt-get install -y nodejs
npm install -g @angular/cli
npm install
