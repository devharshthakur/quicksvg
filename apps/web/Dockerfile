# syntax=docker/dockerfile:1

FROM node:25-slim

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME/bin:$PATH"

RUN npm install -g pnpm

WORKDIR /app

COPY . .

RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile

ARG API_BASE_URL
ENV API_BASE_URL=$API_BASE_URL

RUN pnpm --filter web build

ENV NODE_ENV=production

EXPOSE 4173

CMD ["node", "apps/web/build/index.js"]
