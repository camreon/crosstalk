# Stage 1: Build frontend
FROM node:20-alpine AS frontend-builder

WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# Stage 2: Build backend
FROM node:20-alpine AS backend-builder

WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm ci
COPY backend/ ./
RUN npm run build

# Stage 3: Production image
FROM node:20-alpine AS production

# Install dependencies for better-sqlite3
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Copy backend package files and install production dependencies
COPY backend/package*.json ./
RUN npm ci --only=production

# Rebuild better-sqlite3 for the production environment
RUN npm rebuild better-sqlite3

# Copy compiled backend
COPY --from=backend-builder /app/backend/dist ./dist

# Copy frontend build to public folder
COPY --from=frontend-builder /app/frontend/dist ./public

# Copy seed script for database initialization
COPY backend/src/db/seed.ts ./src/db/seed.ts

# Set production environment
ENV NODE_ENV=production
ENV PORT=8080

# Expose port
EXPOSE 8080

# Start the server
CMD ["node", "dist/index.js"]
