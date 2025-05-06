CREATE TABLE IF NOT EXISTS rents
(
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    resource_type ENUM('ROOM', 'DESK') NOT NULL,
    resource_id BIGINT NOT NULL,
    start_date DATETIME NOT NULL,
    end_date DATETIME NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    status ENUM('PENDING', 'PAID', 'CANCELLED') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS payments
(
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    rent_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_method ENUM('CARD', 'PAYPAL', 'BLIK', 'TRANSFER') NOT NULL,
    status ENUM('PENDING', 'COMPLETED', 'FAILED') NOT NULL,
    transaction_id VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (rent_id) REFERENCES rents(id)
);

CREATE TABLE IF NOT EXISTS resource_availability (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    resource_type ENUM('ROOM', 'DESK') NOT NULL,
    resource_id BIGINT NOT NULL,
    available_from DATE NOT NULL,
    available_to DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );

CREATE TABLE IF NOT EXISTS resource_availability_days (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    availability_id BIGINT NOT NULL,
    day_of_week ENUM('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY') NOT NULL,
    FOREIGN KEY (availability_id) REFERENCES resource_availability(id) ON DELETE CASCADE
    );

CREATE TABLE IF NOT EXISTS resource_availability_hours (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    availability_day_id BIGINT NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
     FOREIGN KEY (availability_day_id) REFERENCES resource_availability_days(id) ON DELETE CASCADE
    );

CREATE TABLE IF NOT EXISTS reservation_codes (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(32) UNIQUE NOT NULL,
    rent_id BIGINT NOT NULL,
    payment_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    expires_at DATETIME NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (rent_id) REFERENCES rents(id),
    FOREIGN KEY (payment_id) REFERENCES payments(id)
    );