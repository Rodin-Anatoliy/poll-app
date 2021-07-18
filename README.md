## Setup

This repo uses [yarn workspaces](https://classic.yarnpkg.com/en/docs/workspaces/)

```
yarn install
```

## Develop

```
yarn run dev
```

or (for usual console out)

```bash
# run mongo(or you can run mongo instance without docker and customize configs)
docker-compose -f docker-compose.dev.yml --env-file dev.env up

#run api
cd ./packages/api-gateway
yarn run dev

#run webapp
cd ../webapp
yarn run dev
```

Frontend will be available at http://localhost:3000
Api docs will be available at http://localhost:3002/api-docs

For dev goals, dev proxy proxies requests from http://localhost:3000/api -> http://localhost:3002

## Production mode

```bash
#run, app will be available on port 9000
docker-compose -f docker-compose.yml --env-file prod.env up -d

#stop
docker-compose -f docker-compose.yml --env-file prod.env down
```
