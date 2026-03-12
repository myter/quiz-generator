# Stage 1: Build
FROM node:22-slim AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY server/ ./server/
RUN npx tsc --project server/tsconfig.json

# Stage 2: Production
FROM node:22-slim

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/server/dist ./server/dist
COPY package.json ./

ENV NODE_ENV=production
EXPOSE 3002

CMD ["node", "server/dist/index.js"]
