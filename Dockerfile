FROM keymetrics/pm2:8-alpine

LABEL mainteiner="Patricio Perpetua <patricio.perpetua.arg@gmail.com>" \
    name="intellidrone/api" \
    architecture="x86_64" \
    vendor="SINGLETON" \
    vcs-type="git" \
    vcs-url="https://gitlab.com/intelliDrone/api.git" \
    distribution-scope="private" \
    Summary="Image to run intellidrone api."

WORKDIR /usr/src/app

COPY src src/
COPY package.json .
COPY pm2.js .

# Install app dependencies
ENV NPM_CONFIG_LOGLEVEL warn
RUN npm install --production

COPY . .

EXPOSE 3000

# Show current folder structure in logs
RUN ls -al -R

CMD [ "pm2-runtime", "start", "pm2.js" ]