FROM node:22-alpine AS deps
WORKDIR /usr/src/app
USER root
COPY --chown=node:node . .
RUN npm ci

FROM deps AS build
RUN npm run tsc

FROM node:22-alpine AS runtime
WORKDIR /usr/src/app
COPY --chown=node:node package.json package-lock.json ./
RUN npm ci --only=production
COPY --from=build /usr/src/app/build ./build
COPY --chown=node:node ./data/nouns.json ./data/
RUN mkdir -p /usr/src/app/logs \
  && chown -R node:node /usr/src/app/logs
USER node
CMD ["npm", "run", "start"]
