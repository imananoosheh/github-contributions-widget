# Use the official Node.js image as a base
FROM node:20

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY github-contributions-fetch/* ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY .env ./.env

# Create static file directory
RUN mkdir -p /usr/src/app/public/

# Expose the port that your app runs on
# Exposing port should be as same as the .env file
EXPOSE 3003

# Command to run the application
CMD ["npm", "start"]
