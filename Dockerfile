# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Update Alpine packages first
RUN apk update && apk upgrade --no-cache

COPY package*.json ./

# Install all dependencies (dev + prod)
RUN npm install

# Copy source code
COPY ./src ./src

# Build TypeScript
RUN npm run build


# Stage 2: Run
FROM node:20-alpine

WORKDIR /app

# Copy only production dependencies
COPY package*.json ./
RUN npm install --omit=dev

# Copy compiled JS from builder
COPY --from=builder /app/dist ./dist

# Copy templates and public (if needed)
COPY ./src/templates ./src/templates
COPY ./src/public ./src/public

EXPOSE 5000
ENV NODE_ENV=production

CMD ["node", "dist/server.js"]
