CREATE TABLE IF NOT EXISTS rents
(
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    date_start  DATETIME,
    date_end    DATETIME,
    payment_id  BIGINT,
    user_id     BIGINT,
    table_id    BIGINT
);

CREATE TABLE IF NOT EXISTS payments
(
    id      BIGINT AUTO_INCREMENT PRIMARY KEY,
    price   INT,
    user_id BIGINT,
    rent_id BIGINT
);