FROM node:18.17.0-alpine3.18 as build

WORKDIR /app

COPY ./build ./build

FROM fholzer/nginx-brotli:v1.24.0 as nginx

WORKDIR /etc/nginx
ADD /nginx/nginx.conf /etc/nginx/nginx.conf

COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 8080

ENTRYPOINT []
CMD ["nginx", "-g", "daemon off;"]