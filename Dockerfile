FROM node:18-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy source code
COPY . .

# Expose port 80
EXPOSE 80

# Start development server with disabled host checking
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "80", "--no-strict-port", "--force"] 