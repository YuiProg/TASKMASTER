# ==========================================
# Stage 1: Build all 4 microservices
# ==========================================
FROM maven:3.9.6-eclipse-temurin-21 AS builder
WORKDIR /build

# Copy and build Core
COPY task-master-core ./task-master-core
RUN mvn -f ./task-master-core/pom.xml clean package -DskipTests

# Copy and build Comment
COPY task-master-comment ./task-master-comment
RUN mvn -f ./task-master-comment/pom.xml clean package -DskipTests

# Copy and build Reports
COPY task-master-reports ./task-master-reports
RUN mvn -f ./task-master-reports/pom.xml clean package -DskipTests

# Copy and build Gateway
COPY task-master-gateway ./task-master-gateway
RUN mvn -f ./task-master-gateway/pom.xml clean package -DskipTests

# ==========================================
# Stage 2: Combined Runtime Image
# ==========================================
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app

# Install supervisor
RUN apt-get update && apt-get install -y supervisor && rm -rf /var/lib/apt/lists/*

# Copy compiled JARs from builder stage
COPY --from=builder /build/task-master-core/target/*.jar /app/task-master-core.jar
COPY --from=builder /build/task-master-comment/target/*.jar /app/task-master-comment.jar
COPY --from=builder /build/task-master-reports/target/*.jar /app/task-master-reports.jar
COPY --from=builder /build/task-master-gateway/target/*.jar /app/task-master-gateway.jar

# Copy Supervisor configuration
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Render exposes Gateway's port (8083)
EXPOSE 8083

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]