FROM ubuntu:focal

RUN apt-get update && \
    apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get update && \
    apt-get install -y nodejs ffmpeg && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /home/app

RUN npm install -g nodemon

COPY backend/package*.json ./

RUN npm install

COPY backend/ .

COPY frontend/dist ./frontend/dist

EXPOSE 3000

CMD ["npm", "start"]
