# Stage 1: Build the React application
FROM node:18-alpine as builder

# Set the working directory
WORKDIR /app

# Copy package.json and yarn.lock files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install

# Copy all the project files
COPY . .

# Build the React application
RUN yarn build

# Stage 2: Serve the built application with Nginx
FROM nginx:latest

# Remove the default Nginx static files
RUN rm -rf /usr/share/nginx/html/*

# Copy the build output from the builder stage
COPY --from=builder /app/build /usr/share/nginx/html

# Expose port 80
EXPOSE 8081

# Start Nginx server
ENTRYPOINT ["nginx", "-g", "daemon off;"]