FROM node:20-alpine as build

WORKDIR /app

COPY apps/frontend/package*.json ./
RUN npm install

COPY apps/frontend ./
COPY domain ../../domain

RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY apps/frontend/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
