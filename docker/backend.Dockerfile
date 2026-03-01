# ---- Build ----
FROM node:20-alpine AS builder
WORKDIR /app
# Monorepo: lock file is at root
COPY package.json package-lock.json ./
COPY backend/package.json ./backend/
RUN npm ci
COPY backend/ ./backend/
WORKDIR /app/backend
RUN npx prisma generate
RUN npm run build

# ---- Production ----
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY package.json package-lock.json ./
COPY backend/package.json ./backend/
RUN npm ci --omit=dev
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/backend/dist ./dist
COPY backend/prisma ./prisma
EXPOSE 3000
CMD ["node", "dist/main.js"]
