# ---------- Stage 1: Build ----------
FROM node:20-alpine AS build

WORKDIR /app

# Install dependencies first (better layer caching)
COPY package.json package-lock.json ./
RUN npm ci

# Copy the rest of the source and build
COPY . .
RUN npm run build

# ---------- Stage 2: Serve ----------
FROM nginx:alpine AS production

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy built assets from the build stage (Vite outputs to /dist)
COPY --from=build /app/dist /usr/share/nginx/html

# Custom nginx config to support SPA client-side routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
