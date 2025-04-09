FROM maven:3.9.9-eclipse-temurin-21
WORKDIR /app
COPY target/*.jar app.jar
EXPOSE 8084

CMD ["java", "-jar", "app.jar"]