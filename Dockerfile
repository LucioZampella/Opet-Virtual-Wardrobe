FROM eclipse-temurin:21-jdk-jammy AS build
WORKDIR /workspace

COPY backend/gradlew backend/build.gradle backend/settings.gradle ./backend/
COPY backend/gradle ./backend/gradle
COPY backend/src ./backend/src

RUN chmod +x ./backend/gradlew \
    && ./backend/gradlew -p backend bootJar -x test --no-daemon

FROM eclipse-temurin:21-jre-jammy AS runtime
WORKDIR /app

RUN useradd --system --uid 1001 appuser
COPY --from=build /workspace/backend/build/libs/*.jar /app/app.jar

USER appuser
ENV PORT=8080
EXPOSE 8080

ENTRYPOINT ["sh", "-c", "exec java ${JAVA_OPTS:-} -Dserver.address=0.0.0.0 -Dserver.port=${PORT:-8080} -jar /app/app.jar"]
