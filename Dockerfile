# Step 1: Build Stage
# Use an official Node.js runtime based on Alpine as the build environment
FROM node:22-alpine AS build

# Set the working directory in the container
WORKDIR /app

# Install build dependencies
RUN apk add --no-cache python3 make g++

# Copy the package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the dependencies
RUN npm install --legacy-peer-deps

# Copy the rest of the application code to the working directory
COPY . .

# Build the Angular application
RUN npm run build --prod

# Step 2: Serve Stage
# Use Nginx based on Alpine as the serve environment
FROM nginx:alpine

# Copy the Angular build output to the Nginx HTML directory
COPY --from=build /app/dist/residentcare /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx when the container starts
CMD ["nginx", "-g", "daemon off;"]
