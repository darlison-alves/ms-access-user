FROM node:18-alpine as builder

ENV NODE_ENV build

WORKDIR /home/app

COPY package*.json ./
RUN npm i

COPY . .
RUN npm run build \
    && npm prune --production

# ---

FROM node:18-alpine

ENV NODE_ENV production

WORKDIR /home/app

COPY --from=builder /home/app/package*.json ./
COPY --from=builder /home/app/node_modules/ ./node_modules/
COPY --from=builder /home/app/dist/ ./dist/

CMD ["node", "dist/main.js"]