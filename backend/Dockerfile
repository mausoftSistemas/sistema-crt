FROM node:18-alpine

# Install dumb-init, wget, postgresql-client and openssl for proper signal handling and health checks
RUN apk add --no-cache dumb-init wget postgresql-client openssl openssl-dev

# Create app directory
WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Copy package files
COPY backend/package*.json ./

# Install dependencies (sin --only=production para evitar problemas)
RUN npm install && npm cache clean --force

# Copy source code
COPY backend/ .

# Make start script executable
RUN chmod +x start.sh

# Create uploads directory with proper permissions
RUN mkdir -p uploads && chown -R nodejs:nodejs uploads && chown nodejs:nodejs start.sh

# Change ownership of node_modules and app directory
RUN chown -R nodejs:nodejs /app

# Change to non-root user
USER nodejs

# Generate Prisma client (después de cambiar usuario)
RUN npx prisma generate

# Expose port
EXPOSE 3001

# Deshabilitar health check temporalmente para diagnosticar
# HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=5 \
#   CMD wget --no-verbose --tries=1 --spider http://localhost:3001/health || exit 1

# Start the application with dumb-init
ENTRYPOINT ["dumb-init", "--"]
CMD ["sh", "-c", "echo 'Iniciando Sistema CRT Backend...' && npx prisma db push && echo 'Base de datos sincronizada' && npm run seed && echo 'Datos iniciales OK' && npm start"]