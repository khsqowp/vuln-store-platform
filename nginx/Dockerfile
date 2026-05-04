FROM nginx:1.24-alpine

COPY nginx.conf /etc/nginx/nginx.conf

RUN mkdir -p /app/uploads /app/static /app/logs && \
    echo "-- VulShop DB Backup (dev)\nINSERT INTO users VALUES (1, 'admin@vulshop.com', '\$2a\$10\$xxx', 'ROLE_ADMIN');" > /app/static/backup.sql && \
    echo "<%@ page language=\"java\" %><html><body>Test Page - VulShop v1.0</body></html>" > /app/static/test.jsp

EXPOSE 80
