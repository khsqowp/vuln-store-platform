# ── Stage 1: Build React frontend ─────────────────────────────────────────────
FROM node:22-alpine AS frontend-build
WORKDIR /app
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ .
RUN npm run build

# ── Stage 2: Build Spring Boot backend ────────────────────────────────────────
FROM eclipse-temurin:21-jdk-jammy AS backend-build
WORKDIR /app
COPY shop/gradlew shop/settings.gradle shop/build.gradle ./
COPY shop/gradle ./gradle
RUN chmod +x ./gradlew
COPY shop/src ./src
RUN ./gradlew bootJar --no-daemon -q

# ── Stage 3: Runtime (Nginx + JRE + supervisord) ──────────────────────────────
FROM eclipse-temurin:21-jre-jammy

RUN apt-get update \
    && apt-get install -y --no-install-recommends nginx supervisor \
    && rm -rf /var/lib/apt/lists/*

# Frontend static files
COPY --from=frontend-build /app/dist /app/static

# Backend jar
COPY --from=backend-build /app/build/libs/*.jar /app/app.jar

# Nginx config — remove default site, add ours
RUN rm -f /etc/nginx/sites-enabled/default
COPY docker/nginx/local.conf /etc/nginx/sites-available/vulshop
RUN ln -s /etc/nginx/sites-available/vulshop /etc/nginx/sites-enabled/vulshop

# Supervisord program config
COPY docker/supervisord.conf /etc/supervisor/conf.d/vulshop.conf

RUN mkdir -p /var/log/supervisor

EXPOSE 80

CMD ["/usr/bin/supervisord", "-n", "-c", "/etc/supervisor/supervisord.conf"]
