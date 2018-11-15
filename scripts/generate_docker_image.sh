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

if ! type "docker" &> /dev/null; then
  echo "Docker is not installed. Install it and then re launch"
  exit 1
fi

function usage(){
  echo -e "First Argument: tag"
  echo -e "Secound Argument: name"
  echo -e "Third Argument: git commit sha"
}

TAG=latest
NAME=registry.gitlab.com/intellidrone/api
CI_COMMIT_SHA=112233
if [ $# -ne 3 ]; then
  echo -e "Illegal number of parameters"
  echo -e "$(usage)"
  read -r -p "Do you want to run script with IMAGE_NAME=${NAME}:${TAG}? [y/N] " response
  if [[ "$response" =~ ^([yY][eE][sS]|[yY])+$ ]]
  then
      echo "Running with IMAGE_NAME=${NAME}:${TAG}"
  else
      exit 1;
  fi
else
    NAME=${1}
    TAG=${2}
    CI_COMMIT_SHA=${3}
fi

export DATE="$(date --rfc-2822 | sed 's/ /T/; s/\(\....\).*-/\1-/g')"

docker build --rm -f Dockerfile -t \
    ${NAME}:${TAG} \
    --label "version=${TAG}" \
    --label "vcs-ref=${CI_COMMIT_SHA}" \
    --label "build-date=${DATE}" .