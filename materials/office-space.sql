CREATE TABLE IF NOT EXISTS city
(
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    city        VARCHAR(255)
    country_id  BIGINT;
    FOREIGN KEY (country_id) REFERENCES countries (id)
);

CREATE TABLE IF NOT EXISTS countries
(
    id      BIGINT AUTO_INCREMENT PRIMARY KEY,
    country VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS addresses
(
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    address     VARCHAR(255),
    city_id     BIGINT,
    country_id  BIGINT,
    FOREIGN KEY (city_id) REFERENCES city (id),
    FOREIGN KEY (country_id) REFERENCES countries (id)
);

CREATE TABLE IF NOT EXISTS buildings
(
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    building    VARCHAR(255),
    description VARCHAR(255),
    address_id  BIGINT,
    FOREIGN KEY (address_id) REFERENCES addresses (id)
);

CREATE TABLE IF NOT EXISTS rooms
(
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    equipment   ENUM('haha'),
    building_id BIGINT,
    FOREIGN KEY (building_id) REFERENCES buildings (id)
);

CREATE TABLE IF NOT EXISTS desks
(
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    equpiment   ENUM('monitor'),
    room_id     BIGINT,
    FOREIGN KEY (room_id) REFERENCES rooms (id)
);

CREATE TABLE IF NOT EXISTS users
(
    id       BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255),
    password VARCHAR(255),
    email    VARCHAR(255),
    phone    BIGINT,
    role     ENUM('admin','owner','user')
);

CREATE TABLE IF NOT EXISTS rents
(
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    date_start  DATETIME,
    date_end    DATETIME,
    payment_id  BIGINT,
    user_id     BIGINT,
    table_id    BIGINT,
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (table_id) REFERENCES tables (id)
);

CREATE TABLE IF NOT EXISTS refresh_tokens
(
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    token           VARCHAR(255),
    expiration_time DATETIME,
    user_id         BIGINT,
    FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE IF NOT EXISTS payments
(
    id      BIGINT AUTO_INCREMENT PRIMARY KEY,
    price   INT,
    user_id BIGINT,
    rent_id BIGINT,
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (rent_id) REFERENCES rents (id)
);
