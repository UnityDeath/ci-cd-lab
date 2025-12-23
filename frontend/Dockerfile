# frontend/Dockerfile
FROM nginx:alpine
COPY public/ /usr/share/nginx/html/
# Можно добавить свой nginx.conf если нужен роутинг
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]