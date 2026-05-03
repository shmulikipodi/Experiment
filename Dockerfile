FROM node:22-bookworm-slim

WORKDIR /app

# Build tools needed in case better-sqlite3 compiles from source
RUN apt-get update && \
    apt-get install -y --no-install-recommends python3 make g++ && \
    rm -rf /var/lib/apt/lists/*

# Install dependencies before copying source (better layer caching)
COPY package*.json ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
