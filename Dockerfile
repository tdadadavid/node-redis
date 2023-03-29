FROM node:18.15.0-bullseye-slim

# specify the working directory
WORKDIR /usr/app/

# copy package.json and package-lock.json to the working directory
COPY package*.json /usr/app/

# install dependencies
RUN npm install

# copy other files to the working directory
COPY . /usr/app/

# speicify an environment variable
ENV PORT 8080

# expose the port in the container
EXPOSE ${PORT}

# specify the start script
CMD [ "npm", "run", "start" ]