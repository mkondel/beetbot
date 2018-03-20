FROM node
EXPOSE 80
WORKDIR /app

ADD build /app
RUN alias ll="ls -lAh"
RUN yarn

# CMD ["/bin/bash"]

# CMD ["yarn", "run", "import"]
CMD ["yarn", "run", "webserver"]