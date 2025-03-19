# Używamy oficjalnego obrazu Node.js jako bazowego
FROM node:18-alpine AS builder

# Ustawiamy katalog roboczy
WORKDIR /app

# Kopiujemy package.json i package-lock.json
COPY package.json package-lock.json ./

# Instalujemy zależności
RUN npm install

# Kopiujemy resztę aplikacji
COPY . .

# Budujemy aplikację
RUN npm run build

# Używamy Nginx do serwowania plików statycznych
FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

# Eksponujemy port 80
EXPOSE 80

# Uruchamiamy Nginx
CMD ["nginx", "-g", "daemon off;"]
