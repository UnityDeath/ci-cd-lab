# frontend/Dockerfile
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY public/ /usr/share/nginx/html/
# Можно добавить свой nginx.conf если нужен роутинг
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]