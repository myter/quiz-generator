# Stage 1: Build (needs devDependencies for tsc)
FROM node:22-slim AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY server/ ./server/
RUN npx tsc --project server/tsconfig.json

# Stage 2: Production (only production deps)
FROM node:22-slim

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/server/dist ./server/dist

ENV NODE_ENV=production
EXPOSE 3002

CMD ["node", "server/dist/index.js"]
