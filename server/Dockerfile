FROM node:24-alpine

WORKDIR /app

# Copy package files
COPY package.json .

# Install dependencies
RUN npm install

# Copy application code
COPY index.mjs .

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["npm", "start"]