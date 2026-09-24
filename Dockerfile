FROM node:24.16.0-bookworm AS build

ARG ENVIRONMENT_NAME=dev

WORKDIR /src

RUN apt-get update && apt-get install -y --no-install-recommends git && rm -rf /var/lib/apt/lists/*

COPY . .

RUN git submodule update --init \
    && cd lib/jsorolla && npm install --ignore-scripts && cd ../.. \
    && npm install --legacy-peer-deps \
    && npm install -g grunt-cli \
    && grunt --env=${ENVIRONMENT_NAME}

FROM nginxinc/nginx-unprivileged:1.27-alpine AS runtime

ARG ENVIRONMENT_NAME=dev

# grunt outputs to build/<name>-<env>; picks up whichever dir matches the env
# Served from a real "eva/" directory (not html/ root) so nginx's own directory
# handling redirects a bare "/eva" request to "/eva/"
COPY --from=build /src/build/*${ENVIRONMENT_NAME}* /usr/share/nginx/html/eva/
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080