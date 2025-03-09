FROM node:18-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy source code
COPY . .

# Create a configuration for Vite to use port 80
RUN echo '{ "server": { "port": 80, "host": "0.0.0.0" } }' > vite.config.port.json

# Expose port 80
EXPOSE 80

# Start development server with custom port
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "80"] 