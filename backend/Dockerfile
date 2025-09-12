FROM node:18-alpine

# Install dumb-init, wget and postgresql-client for proper signal handling and health checks
RUN apk add --no-cache dumb-init wget postgresql-client

# Create app directory
WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Copy package files
COPY package*.json ./

# Install dependencies (sin --only=production para evitar problemas)
RUN npm install && npm cache clean --force

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Make start script executable
RUN chmod +x start.sh

# Create uploads directory with proper permissions
RUN mkdir -p uploads && chown -R nodejs:nodejs uploads && chown nodejs:nodejs start.sh

# Change to non-root user
USER nodejs

# Expose port
EXPOSE 3001

# Deshabilitar health check temporalmente para diagnosticar
# HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=5 \
#   CMD wget --no-verbose --tries=1 --spider http://localhost:3001/health || exit 1

# Start the application with dumb-init
ENTRYPOINT ["dumb-init", "--"]
CMD ["sh", "-c", "echo 'Iniciando backend...' && npx prisma migrate deploy && echo 'Migraciones OK' && npm run seed && echo 'Seed OK' && npm start"]