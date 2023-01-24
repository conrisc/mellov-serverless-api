FROM node:latest
RUN apt update -y
RUN apt upgrade -y
RUN apt install -y default-jre
RUN npm install @openapitools/openapi-generator-cli -g

WORKDIR /home/work

CMD openapi-generator-cli generate -i ./api/mellov-api.yaml -g typescript -o ./mellov-api-client --additional-properties=npmName=mellov_api
