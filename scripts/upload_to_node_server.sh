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
}

TARGET_SERVER=
BRANCH=
USER=
PASS=
FOLDER_KEYS=keys
FILE_PRIVATE_KEY="server.key"
FILE_ORIGINAL="ecosystem.config.js"
FILE_GENERATED="ecosystem.local.config.js"
if [ $# -ne 3 ]; then
  echo -e "Illegal number of parameters"
  echo -e "$(usage)"
  exit 1;
else
    TARGET_SERVER=${1}
    USER=${2}
    PASS=${3}
fi

case "$TARGET_SERVER" in
    "development")
        BRANCH=master
        ;;
    "production")
        BRANCH=develop
        ;;
    *)
        echo "Target server unknown (${TARGET_SERVER}). Valid options development or production"
        exit 1
        ;;
esac

cd ${__root}

if [ -f ${FILE_GENERATED}  ]; then
  rm ${FILE_GENERATED}
fi

# if [ ! -f ${FOLDER_KEYS}/${FILE_PRIVATE_KEY} ]; then
#   echo "Cannot find private key inside folder keys. Name ${FILE_PRIVATE_KEY}"
#   exit 1
# fi

# ssh-add ${FOLDER_KEYS}/${FILE_PRIVATE_KEY}

# ssh-keyscan -H 'web.robotagro.com' >> ~/.ssh/known_hosts


cp ${FILE_ORIGINAL} ${FILE_GENERATED}

sed -e "s/\${GITLAB_USER}/${USER}/" -e "s/\${GITLAB_PASS}/${PASS}/" \
  -e "s/\${BRANCH}/${BRANCH}/" -e "s/\${TARGET_SERVER}/${TARGET_SERVER}/" \
  ${FILE_GENERATED}

pm2 deploy ecosystem.local.config.js production --force