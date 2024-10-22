FROM node:14.5.0-alpine3.12 as builder

WORKDIR /app
COPY package*.json ./
COPY .npmrc ./
RUN npm install
COPY . .
RUN npm run build

# production stage
FROM nginx:stable-alpine as production

COPY --from=builder /app/dist /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/nginx.conf
CMD ["nginx", "-g", "daemon off;"]
