# ---- Build ----
FROM node:20-alpine AS builder
WORKDIR /app
# Monorepo: lock file is at root
COPY package.json package-lock.json ./
COPY frontend/package.json ./frontend/
RUN npm ci
COPY frontend/ ./frontend/
ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL
WORKDIR /app/frontend
RUN npm run build

# ---- Production ----
FROM nginx:alpine
COPY --from=builder /app/frontend/dist /usr/share/nginx/html
# ECS: no backend proxy (ALB routes api.*). Docker Compose: use nginx-frontend.conf
ARG NGINX_CONFIG=ecs
COPY docker/nginx-frontend-${NGINX_CONFIG}.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
