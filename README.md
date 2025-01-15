# TypeScript Demo

Demo projects which demonstrate:
- How to create API server using TypeScript and Express server
- How to create front-end using React and TypeScript
- How to share TypeScript interfaces between front-end and back-end

# How to run

## Install dependencies and build

```bash
bun install

pushd src/lib/models
bun run build
poshd

pushd src/lib/intercom
bun run build
poshd
```

## Run database

```bash
docker-compose up -f docker-compose.dev.yml -d
```

## Run API server

```bash
pushd src/api
bun run prisma:generate
bun run prisma:migrate:dev
bun run spawn-server
poshd
```

## Run front-end

```bash
run run start
```

## Test it

Now you can open your browser and navigate to `http://localhost:3000` to see the front-end application.

Also you can see OpenApi specification at `http://localhost:3001/spec/viewer` and test API endpoints using Swagger UI.
