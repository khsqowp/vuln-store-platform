FROM gradle:8.12-jdk21 AS builder
WORKDIR /app
COPY . .
RUN gradle bootJar --no-daemon -q

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY --from=builder /app/build/libs/*.jar app.jar

RUN mkdir -p /app/uploads /app/logs && \
    chown -R appuser:appgroup /app

USER appuser

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "-Dspring.profiles.active=local", "app.jar"]
