#!/usr/bin/env bash

# Web Page of BASH best practices https://kvz.io/blog/2013/11/21/bash-best-practices/
#Exit when a command fails.
set -o errexit
#Exit when script tries to use undeclared variables.
set -o nounset
#The exit status of the last command that threw a non-zero exit code is returned.
set -o pipefail

#Trace what gets executed. Useful for debugging.
#set -o xtrace

# Set magic variables for current file & dir
__dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
__file="${__dir}/$(basename "${BASH_SOURCE[0]}")"
__base="$(basename ${__file} .sh)"
__root="$(cd "$(dirname "${__dir}")" && pwd)"

if ! type "npm" &> /dev/null; then
  echo "npm is not installed. Install it and then re launch"
  exit 1
fi

if ! type "pm2" &> /dev/null; then
  echo "pm2 is not installed. Install it and then re launch. npm install -g pm2"
  exit 1
fi

if ! type "sed" &> /dev/null; then
  echo "Docker is not installed. Install it and then re launch"
  exit 1
fi

function usage(){
  echo -e "First Argument: server target. development or production"
  echo -e "Secound Argument: Gitlab User."
  echo -e "Third Argument: Gitlab Pass."
  echo -e "Forth Argument: ssh key path (optional)."
}

TARGET_SERVER=
BRANCH=
USER=
PASS=
KEY_SSH="~/.ssh/robotagro"
FILE_ORIGINAL="ecosystem.config.js"
FILE_GENERATED="ecosystem.local.config.js"
if [ $# -lt 3 ]; then
  echo -e "Illegal number of parameters"
  echo -e "$(usage)"
  exit 1;
else
    TARGET_SERVER=${1}
    USER=${2}
    PASS=${3}
    if [ $# -ge 4 ]; then
      KEY_SSH=${4}
    fi
fi

case "$TARGET_SERVER" in
    "development")
        BRANCH=develop
        ;;
    "production")
        BRANCH=master
        ;;
    *)
        echo "Target server unknown (${TARGET_SERVER}). Valid options development or production"
        exit 1
        ;;
esac

if [ -f ${FILE_GENERATED}  ]; then
  rm ${FILE_GENERATED}
fi

sed -e "s/\${GITLAB_USER}/${USER}/" \
    -e "s/\${GITLAB_PASS}/${PASS}/" \
    -e "s/\${BRANCH}/${BRANCH}/" \
    -e "s/\${TARGET_SERVER}/${TARGET_SERVER}/" \
    -e "s+\${KEY_SSH}+${KEY_SSH}+" \
  ${FILE_ORIGINAL} > ${FILE_GENERATED}

pm2 deploy ecosystem.config.js production --force