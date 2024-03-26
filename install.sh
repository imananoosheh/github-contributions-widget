#!/usr/bin/bash

#   Remove any existing version of widget
rm -rf github-contributions-fetch

#   Install requirements
sudo apt install docker docker.io docker-compose -y

#   Download the latest version of the widget
git clone -b main https://github.com/imananoosheh/github-contributions-fetch.git

#   Build the Docker image based on the latest version
docker build -t github-contributions-fetch .

#   Run built image. It always restarts when failed.
#   It watchs docker processes for status check purposes. Press 'q' to quit watch.
docker run -p 3003:3003 -d --restart always --name gh-cal-widget github-contributions-fetch && watch docker ps