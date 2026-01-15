# ================================
# Chrono - Expo React Native App
# Multi-stage Dockerfile
# ================================

# ====================
# Stage 1: Base Image
# ====================
FROM node:20-alpine AS base

# Install system dependencies
RUN apk add --no-cache \
    git \
    python3 \
    make \
    g++ \
    && rm -rf /var/cache/apk/*

# Set working directory
WORKDIR /app

# ====================
# Stage 2: Dependencies
# ====================
FROM base AS deps

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci --legacy-peer-deps

# ====================
# Stage 3: Development
# ====================
FROM base AS development

WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy source code
COPY . .

# Expose Expo ports
# Metro bundler (default)
EXPOSE 8081
# Expo DevTools
EXPOSE 19000
EXPOSE 19001
EXPOSE 19002

# Environment variables
ENV EXPO_DEVTOOLS_LISTEN_ADDRESS=0.0.0.0
ENV REACT_NATIVE_PACKAGER_HOSTNAME=0.0.0.0

# Start Expo development server
CMD ["npx", "expo", "start", "--tunnel"]

# ====================
# Stage 4: Web Build
# ====================
FROM base AS web-builder

WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy source code
COPY . .

# Build web version
RUN npx expo export --platform web

# ====================
# Stage 5: Web Production
# ====================
FROM nginx:alpine AS web-production

# Copy custom nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built web files
COPY --from=web-builder /app/dist /usr/share/nginx/html

# Expose HTTP port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:80/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
