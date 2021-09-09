FROM node:14.17.4

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
ENV NODE_ENV production
ENV NEXT_PUBLIC_API_URL https://chepi-back-allohamora.cloud.okteto.net/
RUN npm run build

EXPOSE 3000

CMD npm run start