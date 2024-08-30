CREATE TABLE IF NOT EXISTS country
(
    id      BIGINT AUTO_INCREMENT PRIMARY KEY,
    country VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS city
(
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    city        VARCHAR(255),
    country_id  BIGINT,
    FOREIGN KEY (country_id) REFERENCES country (id)
    );


CREATE TABLE IF NOT EXISTS address
(
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    address     VARCHAR(255),
    city_id     BIGINT,
    country_id  BIGINT,
    FOREIGN KEY (city_id) REFERENCES city (id),
    FOREIGN KEY (country_id) REFERENCES country (id)
    );

CREATE TABLE IF NOT EXISTS building
(
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    building    VARCHAR(255),
    description VARCHAR(255),
    address_id  BIGINT,
    FOREIGN KEY (address_id) REFERENCES address (id)
    );

CREATE TABLE IF NOT EXISTS room
(
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    equipment   ENUM('haha'),
    building_id BIGINT,
    FOREIGN KEY (building_id) REFERENCES building (id)
    );

CREATE TABLE IF NOT EXISTS desk
(
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    equpiment   ENUM('monitor'),
    room_id     BIGINT,
    FOREIGN KEY (room_id) REFERENCES room (id)
    );


