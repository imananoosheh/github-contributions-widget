#!/usr/bin/bash
BGreen='\033[1;32m' # Bold Green
NC='\033[0m'        # No Color
function customLog() {
    echo -e "${BGreen}⚙ $@${NC}"

}

customLog "Installing GitHub Calendar Widget..."

github_token=''
read -p "Enter your GitHub access token: " github_token
server_port=3003
read -e -p "Enter server port (Enter to accept the default): " -i "$server_port" server_port
customLog "Server port is set to: $server_port"
static_directory='/usr/src/app/public/'
read -e -p "Enter static directory (Enter to accept the default): " -i "$static_directory" static_directory
customLog "Static directory is set to: $static_directory"

# Write to .env File
cat <<EOF >.env
GITHUB_ACCESS_TOKEN=$github_token
SERVER_PORT=$server_port
STATIC_DIR=$static_directory
EOF

customLog ".env File is created."

sudo apt update

dependencies=("git" "docker.io" "docker-compose" "watch")

for dep in "${dependencies[@]}"; do
    which $dep >/dev/null 2>&1
    if [ $? -ne 0 ]; then
        customLog "Missing dependency: $dep. Installing $dep..."
        sudo apt install $dep -y
    else
        customLog "Dependency $dep is installed."
    fi
done

#   Remove any existing version of widget
ls github-contributions-widget >/dev/null 2>&1
if [ $? -eq 0 ]; then
    rm -rf github-contributions-widget
fi

#   Download the latest version of the widget
git clone -b latest https://github.com/imananoosheh/github-contributions-widget.git

mv .env github-contributions-widget/.env

cd github-contributions-widget

#   Build the Docker image based on the latest version
docker build \
    --build-arg SERVER_PORT=$SERVER_PORT \
    --build-arg STATIC_DIR=$STATIC_DIR \
    -t github-contributions-widget .

#   Run built image. It always restarts when failed.
#   It watchs docker processes for status check purposes. Press 'q' to quit watch.
docker run -p 3003:3003 -d --restart always --name gh-cal-widget github-contributions-widget && watch docker ps
