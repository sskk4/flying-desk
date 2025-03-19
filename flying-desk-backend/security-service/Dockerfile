# Etap 1: Pobierz odpowiednią wersję JDK
FROM eclipse-temurin:22-jdk AS jdk

# Etap 2: Budowanie aplikacji
FROM gradle:8.6-jdk21 AS build

# Kopiuj JDK 22 z pierwszego etapu
COPY --from=jdk /opt/java/openjdk /opt/java/openjdk22
ENV JAVA_HOME=/opt/java/openjdk22

WORKDIR /app

# Kopiuj pliki projektu
COPY build.gradle settings.gradle ./
COPY gradle ./gradle
COPY gradlew ./
COPY src ./src

# Modyfikacja build.gradle, aby używać ścieżki do JDK 22
RUN sed -i 's/languageVersion.of(22)/languageVersion.of(22).convention(22)/' build.gradle

# Buduj aplikację
RUN chmod +x ./gradlew
RUN ./gradlew build --no-daemon -x test

# Etap 3: Uruchamianie aplikacji
FROM eclipse-temurin:22-jre

WORKDIR /app

# Kopiuj zbudowany JAR z etapu budowania
COPY --from=build /app/build/libs/*.jar app.jar

# Eksponuj port aplikacji
EXPOSE 8080

# Uruchom aplikację
ENTRYPOINT ["java", "-jar", "/app/app.jar"]