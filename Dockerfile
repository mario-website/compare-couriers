
# Build the React application environment
FROM node:14 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Run the application in the production environment
FROM mcr.microsoft.com/playwright:focal
WORKDIR /app

# Set the environment variable
ENV PLAYWRIGHT_BROWSERS_PATH=/app/.cache/ms-playwright

# Install Playwright browsers
RUN npm install playwright && \
    npx playwright install --with-deps

# Copy files from the build stage
COPY --from=build /app/build /app/build
COPY --from=build /app/server.js /app/server.js
COPY --from=build /app/package*.json /app/
COPY --from=build /app/src/assets /app/src/assets 

# Install production dependencies
RUN npm install --only=production

# Set the user to 'node'
USER 1000

ENV NODE_ENV=production
EXPOSE 8080
CMD ["node", "server.js"]
