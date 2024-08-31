# Use the official Node.js 18 image as a parent image
FROM node:18-alpine

# Set the working directory in the Docker container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (or yarn.lock) to the container working directory
COPY package*.json ./

# Install project dependencies using npm
RUN yarn install

# Bundle the source code inside the Docker image
COPY . .

# Set the environment variable to use port 5000
ENV PORT=6000

# Open port 5000 to have it mapped by the docker daemon
EXPOSE 6000

# Define the command to run the app
CMD ["npm", "start"]
