# Multi-stage Dockerfile for the CodeCraftHub user management service

# 1) Build stage (installs dependencies)
FROM node:20-alpine AS base

# Set working directory inside the container
WORKDIR /usr/src/app

# Install dependencies first (leverages Docker layer cache)
COPY package*.json ./

# Install all dependencies (including dev; adjust to --only=production for prod-only image)
RUN npm install --omit=dev

# 2) Runtime image
FROM node:20-alpine AS runtime

WORKDIR /usr/src/app

# Copy only node_modules from build stage
COPY --from=base /usr/src/app/node_modules ./node_modules

# Copy source code
COPY src ./src
COPY tests ./tests
COPY README.md ./
COPY package*.json ./

# Expose the application port (matches PORT in .env / default 5000)
EXPOSE 5000

# Set NODE_ENV to production inside the container
ENV NODE_ENV=production

# Start the application
CMD ["npm", "start"]
