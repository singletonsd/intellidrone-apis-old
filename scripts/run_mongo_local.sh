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
  echo -ne "Docker is not installed. Install it and then re launch"
  exit 1
fi

HOST=
PORT=27017
PASSWORD=PassWord
USER=root
function usage(){
    echo "ERROR: no arguments provided."
    echo "-h|--host: configurated host. "
    echo "-p|--password: password. "
    echo "-P|--port: port. Default 27017 "
    exit 1
}

while [[ $# -gt 0 ]]
do
    key="$1"
    case $key in
        -h|--host)
            HOST="${2}"
            shift # past argument
            shift # past value
        ;;
        -p|--password)
            HOST="${2}"
            shift # past argument
            shift # past value
        ;;
        -P|--port)
            HOST="${2}"
            shift # past argument
            shift # past value
        ;;
        *)    # unknown option
            usage
        ;;
    esac
done

CONTAINER_NAME=intellidrone-mongodb-test
IMAGE_NAME=mongo:4.0

if [ "$(docker ps -aq -f name="${CONTAINER_NAME}")" ]; then
    if [ "$(docker ps -aq -f status=exited -f name=${CONTAINER_NAME})" ]; then
        docker start "${CONTAINER_NAME}" > /dev/null 2>&1
    fi
else
    # docker run -e MONGO_INITDB_ROOT_USERNAME=${USER} -e MONGO_INITDB_ROOT_PASSWORD=${PASSWORD} \
    #     -p ${PORT}:27017 -d \
    #     --name ${CONTAINER_NAME} ${IMAGE_NAME}
    docker run -p ${PORT}:27017 -d \
        --name ${CONTAINER_NAME} ${IMAGE_NAME}
fi

CONTAINER_IP=$(docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' ${CONTAINER_NAME})
echo "Waiting port to be open ${CONTAINER_IP}:3306..."
while ! nc -z ${CONTAINER_IP} 3306; do
    sleep 0.5 # wait for 1/10 of the second before check again
done
echo "Container ready"

PORT=$(docker port ${CONTAINER_NAME} | sed 's/^.*://')
PASSWORD=$(docker inspect -f "{{ .Config.Env }}" ${CONTAINER_NAME} | cut -d ' ' -f2 | cut -d '=' -f2)

echo "Mysql Container running. Port:${PORT}, Name:${CONTAINER_NAME}, User:${USER}, Password:${PASSWORD}, IP:${CONTAINER_IP}"