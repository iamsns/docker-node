FROM node

ENV MONGO_USERNAME=admin \
    MONGO_PASSWORD=qwert \
    MONGO_URL="mongodb://admin:qwert@node_app-mongo-doc-1:27017"

# Set the working directory
WORKDIR /testapp

COPY . .

RUN npm install

EXPOSE 3000

CMD ["node", "/testapp/index.js"]