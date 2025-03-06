
FROM node:20.12.2-alpine3.18 AS base
RUN apk add --no-cache tzdata
ENV TZ=America/Campo_Grande
FROM base AS deps
WORKDIR /app
ADD package.json package-lock.json ./
RUN npm ci
FROM base AS production-deps
WORKDIR /app
ADD package.json package-lock.json ./
RUN npm ci --only=production
FROM base AS build
WORKDIR /app
COPY --from=deps /app/node_modules /app/node_modules
ADD . .
RUN node ace build --ignore-ts-errors
FROM base AS production
ENV NODE_ENV=production
WORKDIR /app
COPY --from=production-deps /app/node_modules /app/node_modules
COPY --from=build /app/build /app
COPY --from=build /app/.env /app
RUN npm install
EXPOSE 3333
CMD ["node", "./bin/server.js"]