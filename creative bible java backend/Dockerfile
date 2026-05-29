# Use Eclipse Temurin Maven image to build the app
FROM maven:3.8.8-eclipse-temurin-17 AS build
COPY . .
RUN mvn clean package -DskipTests

# Use Eclipse Temurin JRE image to run the app
FROM eclipse-temurin:17-jre-alpine
COPY --from=build /target/*.jar app.jar
ENTRYPOINT ["java","-Dserver.port=${PORT:8080}","-jar","/app.jar"]