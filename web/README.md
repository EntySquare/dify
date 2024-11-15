# Frontend

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

### Run by source code

To start the web frontend service, you will need [Node.js v18.x (LTS)](https://nodejs.org/en) and [NPM version 8.x.x](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/).

First, install the dependencies:

```bash
npm install
# or
yarn install --frozen-lockfile
```

Then, configure the environment variables. Create a file named `.env.local` in the current directory and copy the contents from `.env.example`. Mo the values of these environment variables according to your requirements:

```bash
cp .env.example .env.local
```

```
# For production release, change this to PRODUCTION
NEXT_PUBLIC_DEPLOY_ENV=DEVELOPMENT
# The deployment edition, SELF_HOSTED
NEXT_PUBLIC_EDITION=SELF_HOSTED
# The base URL of console application, refers to the Console base URL of WEB service if console domain is
# different from api or web app domain.
NEXT_PUBLIC_API_PREFIX=http://localhost:5001/console/api
# The URL for Web APP, refers to the Web App base URL of WEB service if web app domain is different from
# console or api domain.
# example: http://udify.app/api
NEXT_PUBLIC_PUBLIC_API_PREFIX=http://localhost:5001/api

# SENTRY
NEXT_PUBLIC_SENTRY_DSN=
```

Finally, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the file under folder `app`. The page auto-updates as you edit the file.

## Deploy

### Deploy on server

First, build the app for production:

```bash
npm run build
```

Then, start the server:

```bash
npm run start
```

If you want to customize the host and port:

```bash
npm run start --port=3001 --host=0.0.0.0
```

## Storybook

This project uses [Storybook](https://storybook.js.org/) for UI component development.

To start the storybook server, run:

```bash
yarn storybook
```

Open [http://localhost:6006](http://localhost:6006) with your browser to see the result.

## Lint Code

If your IDE is VSCode, rename `web/.vscode/settings.example.json` to `web/.vscode/settings.json` for lint code setting.

## Test

We start to use [Jest](https://jestjs.io/) and [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) for Unit Testing.

You can create a test file with a suffix of `.spec` beside the file that to be tested. For example, if you want to test a file named `util.ts`. The test file name should be `util.spec.ts`.

Run test:

```bash
npm run test
```

If you are not familiar with writing tests, here is some code to refer to:

* [classnames.spec.ts](./utils/classnames.spec.ts)
* [index.spec.tsx](./app/components/base/button/index.spec.tsx)

## Documentation

Visit [https://docs.dify.ai/getting-started/readme](https://docs.dify.ai/getting-started/readme) to view the full documentation.

## Community

The Dify community can be found on [Discord community](https://discord.gg/5AEfbxcd9k), where you can ask questions, voice ideas, and share your projects.

docker build . -t  11153123/enty-web:0.0.2

docker run -it -p 3000:3000 -e CONSOLE_API_URL=http://127.0.0.1:5001 -e APP_API_URL=http://127.0.0.1:5001 -e TG_API_3010=http://127.0.0.1:5001 -e TG_API_WS_3010=http://127.0.0.1:5001 11153123/enty-web:0.0.2

docker run -it -p 3000:3000
-e CONSOLE_API_URL=http://54.255.214.62:5001
-e APP_API_URL=http://54.255.214.62:5001
-e TG_API_3010=http://54.255.214.62:3010
-e TG_API_WS_3010=ws://54.255.214.62:3010
11153123/enty-web:0.0.3

# Version History

2024/08/19 fbf31b5d5269db67bed7dae4d3e9a09ded89dd0c
