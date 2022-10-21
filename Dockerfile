## base stage
FROM node:lts-alpine AS base

WORKDIR /app

RUN apk add --no-cache g++ git curl make python3 libc6-compat \
  && curl -f https://get.pnpm.io/v6.16.js | node - add --global pnpm

## dependency stage
FROM base AS dependencies

COPY package.json pnpm-*.yaml ./

# For CI: true, if a lockfile is present
RUN pnpm install --frozen-lockfile

## build stage
FROM base AS builder

COPY . .

COPY --from=dependencies /app/node_modules ./node_modules

RUN pnpm run build

## production stage
FROM mcr.microsoft.com/playwright:next-jammy as production

WORKDIR /app

RUN apt-get update \
  && apt-get install -y curl build-essential \
  && curl -f https://get.pnpm.io/v6.16.js | node - add --global pnpm

COPY --from=builder /app/package.json /app/pnpm-*.yaml  ./

RUN pnpm install --prod --frozen-lockfile

COPY --from=builder /app/dist ./dist

EXPOSE 3100

ENV PORT 3100

HEALTHCHECK --interval=30s --timeout=20s --start-period=15s --retries=3 \
  CMD curl -fSs localhost:3100 || exit 1

CMD [ "pnpm", "run", "start:prod" ]
