CREATE TABLE IF NOT EXISTS rents
(
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    office_id BIGINT NULL,
    desk_id BIGINT NULL,
    rent_type VARCHAR(10) NOT NULL CHECK (rent_type IN ('room', 'desk')),
    start_date DATETIME NOT NULL,
    end_date DATETIME NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'paid', 'cancelled')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS payments
(
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    rent_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL CHECK (payment_method IN ('card', 'paypal', 'blik', 'transfer')),
    status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'completed', 'failed')),
    transaction_id VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (rent_id) REFERENCES rents(id)
);

CREATE TABLE IF NOT EXISTS desk_rent_options
(
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    desk_id BIGINT NOT NULL,
    available_from DATE NOT NULL,
    available_to DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS desk_rent_days
(
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    desk_rent_option_id BIGINT NOT NULL,
    day_of_week ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (desk_rent_option_id) REFERENCES desk_rent_options(id) ON DELETE CASCADE
    );