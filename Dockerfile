FROM node:20-alpine
WORKDIR /app
RUN npm install -g pnpm
COPY . .
RUN pnpm install --no-frozen-lockfile
WORKDIR /app/artifacts/api-server
RUN pnpm run build
EXPOSE 3000
CMD ["node", "--enable-source-maps", "./dist/index.mjs"]
