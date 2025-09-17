# Build stage - Force rebuild for new domains
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (cambiar npm ci por npm install)
RUN npm install

# Copy source code
COPY . .

# Accept build argument
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Build the application
RUN npm run build

# Production stage - Usar serve en lugar de nginx
FROM node:18-alpine

# Install serve globally and wget for health checks
RUN apk add --no-cache wget
RUN npm install -g serve

# Copy built app from builder stage
COPY --from=builder /app/dist /app

WORKDIR /app

# Expose port
EXPOSE 3000

# Add health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

# Start serve on port 3000
CMD ["serve", "-s", ".", "-l", "3000"]