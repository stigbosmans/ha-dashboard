FROM node:18-alpine as build

WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Production stage with a simple HTTP server
FROM node:18-alpine

WORKDIR /app

# Install serve
RUN npm install -g serve

# Copy built app from build stage
COPY --from=build /app/dist /app

# Expose port 80
EXPOSE 80

# Serve the app
CMD ["serve", "-s", ".", "-l", "80"] 