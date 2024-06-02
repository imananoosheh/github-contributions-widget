#!/usr/bin/bash

sudo apt update

dependencies=("git" "docker" "docker.io" "docker-compose" "watch")

for dep in "${dependencies[@]}"; do
    which $dep > /dev/null 2>&1
    if [ $? -ne 0 ]; then
        echo "Missing dependency: $dep. Installing $dep..."
        sudo apt install $dep -y
    else
        echo "Dependency $dep is installed."
    fi
done

#   Remove any existing version of widget
ls github-contributions-widget > /dev/null 2>&1
if [ $? -eq 0 ]; then
    rm -rf github-contributions-widget
fi

#   Download the latest version of the widget
git clone -b latest https://github.com/imananoosheh/github-contributions-widget.git

cd github-contributions-widget

#   Build the Docker image based on the latest version
docker build -t github-contributions-widget .

#   Run built image. It always restarts when failed.
#   It watchs docker processes for status check purposes. Press 'q' to quit watch.
docker run -p 3003:3003 -d --restart always --name gh-cal-widget github-contributions-widget && watch docker ps