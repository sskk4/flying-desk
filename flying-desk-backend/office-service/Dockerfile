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

# Buduj aplikację (pomijamy testy, jeśli nie chcesz ich uruchamiać podczas budowy)
RUN chmod +x ./gradlew
RUN ./gradlew build --no-daemon -x test

# Etap 3: Uruchamianie aplikacji (w tym instalacja Google Cloud SDK)
FROM eclipse-temurin:22-jre AS runtime

WORKDIR /app

# Instalowanie Google Cloud SDK
RUN apt-get update && apt-get install -y curl gnupg && \
    curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | apt-key add - && \
    echo "deb https://packages.cloud.google.com/apt cloud-sdk main" | tee -a /etc/apt/sources.list.d/google-cloud-sdk.list && \
    apt-get update && apt-get install -y google-cloud-sdk

# Kopiuj zbudowany JAR z etapu budowania
COPY --from=build /app/build/libs/*.jar app.jar

# Kopiuj konfigurację Google Cloud do kontenera (jeśli potrzebne)
COPY gcp-key.json /app/gcp-key.json

# Uwierzytelnienie Google Cloud Service Account
RUN gcloud auth activate-service-account --key-file=/app/gcp-key.json

# Eksponuj port aplikacji
EXPOSE 8081

# Uruchom aplikację
ENTRYPOINT ["java", "-Dspring.datasource.url=jdbc:mysql://mysql:3306/flying_desk_office", "-Dspring.datasource.username=root", "-Dspring.datasource.password=root", "-Dspring.cloud.gcp.storage.credentials.file=/app/gcp-key.json", "-jar", "/app/app.jar"]
