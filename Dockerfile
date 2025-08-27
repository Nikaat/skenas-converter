FROM ghcr.io/puppeteer/puppeteer:22.6.3

WORKDIR /app

# Puppeteer won't auto-download; we'll install the browser ourselves
ENV PUPPETEER_SKIP_DOWNLOAD=true
ENV PUPPETEER_CACHE_DIR=/home/pptruser/.cache/puppeteer

COPY . .

# Better caching for deps
# COPY package*.json ./
RUN npm install

# Make sure the cache dir exists (as pptruser, it's already writable in $HOME)
RUN mkdir -p "$PUPPETEER_CACHE_DIR"

# Install the exact Chrome Puppeteer expects (managed-browsers)
RUN npx puppeteer@22.6.3 browsers install chrome --cache-dir="$PUPPETEER_CACHE_DIR"

# App code
RUN npx tsc
RUN mkdir -p dist

# Heads-up: non-root processes can't bind to :80 without extra caps
EXPOSE 8080
ENV PORT=8080

CMD ["npm", "run", "start"]