# Use the official Node.js image as a base
FROM node:20

# Declare build arguments
ARG SERVER_PORT
ARG STATIC_DIR

# Use the build arguments
ENV SERVER_PORT=${SERVER_PORT}
ENV STATIC_DIR=${STATIC_DIR}

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY ./package*.json ./
COPY ./server.js ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY .env ./.env

# Create static file directory
RUN mkdir -p ${STATIC_DIR}

# Expose the port that your app runs on
# Exposing port should be as same as the .env file
EXPOSE ${SERVER_PORT}

# Command to run the application
CMD ["npm", "start"]
