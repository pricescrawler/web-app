FROM node:22-alpine AS build
WORKDIR /app

# Vite inlines VITE_* variables at build time, so they are build args, not runtime env.
ARG VITE_API_URL
ARG VITE_EMAIL
ARG VITE_API_TIMEOUT
ARG VITE_MAINTENANCE_MODE
ARG VITE_MAINTENANCE_END_DATE
ARG VITE_MOBILE_APP_URL
ARG VITE_DONATE_URL

COPY package.json package-lock.json .npmrc ./
RUN npm ci --no-audit --no-fund
COPY . .
RUN npm run build

FROM nginxinc/nginx-unprivileged:1.29-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 3000
