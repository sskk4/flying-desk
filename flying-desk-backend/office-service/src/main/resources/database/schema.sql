CREATE TABLE IF NOT EXISTS country (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    country VARCHAR(255)
    );

CREATE TABLE IF NOT EXISTS city (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    city VARCHAR(255),
    country_id BIGINT,
    FOREIGN KEY (country_id) REFERENCES country (id)
    );

CREATE TABLE IF NOT EXISTS address (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    address VARCHAR(255),
    city_id BIGINT,
    country_id BIGINT,
    FOREIGN KEY (city_id) REFERENCES city (id),
    FOREIGN KEY (country_id) REFERENCES country (id)
    );

CREATE TABLE IF NOT EXISTS building (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    building VARCHAR(255),
    description VARCHAR(255),
    address_id BIGINT,
    user_id BIGINT,
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    edit_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    status ENUM('ACTIVE', 'INACTIVE', 'UNDER_REVIEW') DEFAULT 'ACTIVE',
    is_approved BOOLEAN DEFAULT FALSE, -- Pole wskazujące, czy zostało zaakceptowane przez administratora
    FOREIGN KEY (address_id) REFERENCES address (id)
    );


CREATE TABLE IF NOT EXISTS room (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    room VARCHAR(255),
    equipment TEXT,
    building_id BIGINT,
    description TEXT,
    max_occupants INT,
    price DECIMAL(10, 2),
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    edit_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    status ENUM('AVAILABLE', 'BOOKED', 'OUT_OF_SERVICE') DEFAULT 'AVAILABLE',
    is_approved BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (building_id) REFERENCES building (id)
    );


CREATE TABLE IF NOT EXISTS desk (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    desk VARCHAR(255),
    equipment TEXT,
    building_id BIGINT,
    description TEXT,
    price DECIMAL(10, 2),
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    edit_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    status ENUM('AVAILABLE', 'BOOKED', 'OUT_OF_SERVICE') DEFAULT 'AVAILABLE',
    is_approved BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (building_id) REFERENCES building (id)
    );

CREATE TABLE IF NOT EXISTS photo (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    photo_type VARCHAR(255) NOT NULL,
    related_id BIGINT NOT NULL,
    url VARCHAR(255) NOT NULL
    );

CREATE TABLE IF NOT EXISTS submission (
   id BIGINT AUTO_INCREMENT PRIMARY KEY,
   user_id VARCHAR(255),
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(100) NOT NULL,
    country VARCHAR(50) NOT NULL,
    address TEXT NOT NULL,
    building_name VARCHAR(100) NOT NULL,
    building_description TEXT NOT NULL,
    status ENUM('PENDING', 'APPROVED', 'REJECTED') DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );