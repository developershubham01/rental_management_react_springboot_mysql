CREATE TABLE IF NOT EXISTS users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(30) NOT NULL,
    active BIT(1) NOT NULL DEFAULT 1,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS properties (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description VARCHAR(2000) NOT NULL,
    city VARCHAR(255) NOT NULL,
    locality VARCHAR(255) NOT NULL,
    address VARCHAR(1000) NOT NULL,
    latitude DOUBLE NULL,
    longitude DOUBLE NULL,
    price DECIMAL(12,2) NOT NULL,
    security_deposit DECIMAL(12,2) NULL,
    bedrooms INT NOT NULL,
    bathrooms INT NOT NULL,
    furnished BIT(1) NOT NULL DEFAULT 0,
    available BIT(1) NOT NULL DEFAULT 1,
    property_type VARCHAR(30) NOT NULL,
    approval_status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    owner_id BIGINT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_properties_owner FOREIGN KEY (owner_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS property_amenities (
    property_id BIGINT NOT NULL,
    amenity VARCHAR(255) NOT NULL,
    PRIMARY KEY (property_id, amenity),
    CONSTRAINT fk_amenities_property FOREIGN KEY (property_id) REFERENCES properties(id)
);

CREATE TABLE IF NOT EXISTS property_images (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    image_url VARCHAR(500) NOT NULL,
    is_primary BIT(1) NOT NULL DEFAULT 0,
    property_id BIGINT NOT NULL,
    CONSTRAINT fk_images_property FOREIGN KEY (property_id) REFERENCES properties(id)
);

CREATE TABLE IF NOT EXISTS bookings (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    property_id BIGINT NOT NULL,
    tenant_id BIGINT NOT NULL,
    visit_date DATE NOT NULL,
    visit_time TIME NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    note VARCHAR(1000) NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_bookings_property FOREIGN KEY (property_id) REFERENCES properties(id),
    CONSTRAINT fk_bookings_tenant FOREIGN KEY (tenant_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS payments (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    property_id BIGINT NOT NULL,
    tenant_id BIGINT NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'INR',
    status VARCHAR(30) NOT NULL DEFAULT 'CREATED',
    razorpay_order_id VARCHAR(255) NOT NULL UNIQUE,
    razorpay_payment_id VARCHAR(255) NULL,
    razorpay_signature VARCHAR(255) NULL,
    paid_at DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_payments_property FOREIGN KEY (property_id) REFERENCES properties(id),
    CONSTRAINT fk_payments_tenant FOREIGN KEY (tenant_id) REFERENCES users(id)
);

CREATE INDEX idx_properties_city ON properties(city);
CREATE INDEX idx_properties_price ON properties(price);
CREATE INDEX idx_properties_bedrooms ON properties(bedrooms);
CREATE INDEX idx_bookings_tenant ON bookings(tenant_id);
CREATE INDEX idx_payments_tenant ON payments(tenant_id);

