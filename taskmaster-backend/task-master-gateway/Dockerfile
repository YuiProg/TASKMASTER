# Stage 1: Build the application
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app

# Copy the pom.xml and source code
COPY pom.xml .
COPY src ./src

# Package the application (skip tests for faster build times)
RUN mvn clean package -DskipTests

# Stage 2: Run the application
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app

# Copy the built jar from Stage 1
COPY --from=build /app/target/*.jar app.jar

# Expose the main backend port
EXPOSE 8083

ENTRYPOINT ["java", "-jar", "app.jar"]