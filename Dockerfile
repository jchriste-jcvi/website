FROM node:12.22-alpine3.12@sha256:29c7b0f61218ec57a2ac36778a3954e3f8b32f43294aaf960d2fbb3452229335

ARG GITHUB_BRANCH
ARG GITHUB_COMMIT

ENV GITHUB_BRANCH=${GITHUB_BRANCH:-master}
ENV GITHUB_COMMIT=${GITHUB_COMMIT}

RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh openjdk8

USER node

WORKDIR /app/website

RUN cd /app && \
    git clone -b $GITHUB_BRANCH https://github.com/BV-BRC/website.git && \
    cd website && \
    git checkout $GITHUB_COMMIT && \
    git submodule update --init --recursive && \
    npm install --only=prod
    # npm ci --prefer-offline --only=production

RUN ./buildClient.sh

COPY p3-web.conf p3-web.conf

ENV NODE_ENV production

CMD ["npm", "start"]

# Build example
# docker build --build-arg GITHUB_COMMIT=$(git rev-parse --short HEAD) --build-arg GITHUB_BRANCH="develop" -t bvbrc-web:0.1 .