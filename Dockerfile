FROM keymetrics/pm2:8-alpine

LABEL mainteiner="Patricio Perpetua <patricio.perpetua.arg@gmail.com>" \
    name="intellidrone/api" \
    architecture="x86_64" \
    vendor="SINGLETON" \
    vcs-type="git" \
    vcs-url="https://gitlab.com/intelliDrone/api.git" \
    distribution-scope="private" \
    Summary="Image to run intellidrone api."

RUN apk add --no-cache \
    python \
    make gcc g++ 

ENV PYTHON /usr/bin/python

WORKDIR /usr/src/app

COPY src src/
COPY package.json .
COPY environment/.docker.env ./.env
# Install app dependencies
ENV NPM_CONFIG_LOGLEVEL warn
RUN npm install --production

EXPOSE 3000

# Show current folder structure in logs
RUN ls -al -R

CMD [ "pm2-runtime", "start", "src/index.js" ]