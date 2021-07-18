FROM node:14.15.4-alpine
RUN npm install pm2 -g
WORKDIR /usr/app
COPY . .
RUN yarn install --pure-lockfile --non-interactive
WORKDIR /usr/app/packages/webapp

EXPOSE 3000 443 43554

RUN yarn build

CMD [ "pm2-runtime", "start", "npm", "--", "start" ]
