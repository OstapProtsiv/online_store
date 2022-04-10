CREATE TABLE user (

);

CREATE TABLE user1 (
    id SERIAL PRIMARY KEY,
    email VARCHAR(250) NOT NULL UNIQUE,
    password VARCHAR(250) NOT NULL,
    role VARCHAR(100) DEFAULT USER
);

CREATE TABLE basket(
    id SERIAL PRIMARY KEY,
    user_id INT,
    CONSTRAINT user_id FOREIGN KEY (user_id)
    REFERENCES user1 (id)
);

CREATE TABLE device(
    id SERIAL PRIMARY KEY,
    name VARCHAR(250) UNIQUE NOT NULL,
    price INT,
    rating INT DEFAULT 0,
    img  VARCHAR(300),
    type_id INT REFERENCES type1 (id),
    brand_id INT REFERENCES brand (id)
);

CREATE TABLE type1 (
    id SERIAL PRIMARY KEY,
    name VARCHAR(250) NOT NULL UNIQUE
);

CREATE TABLE brand (
    id SERIAL PRIMARY KEY,
    name VARCHAR(250) NOT NULL
);

CREATE TABLE type_brand(
    id SERIAL PRIMARY KEY,
    type_id INT REFERENCES type1 (id),
    brand_id INT REFERENCES brand (id)
);

CREATE TABLE device_info(
    id SERIAL PRIMARY KEY,
    device_id INT REFERENCES device (id),
    title VARCHAR(250),
    description VARCHAR(250)
);

CREATE TABLE rating(
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES user1(id),
    device_id INT REFERENCES device(id),
    rate INT
);

CREATE TABLE basket_device(
    id SERIAL PRIMARY KEY,
    device_id INT REFERENCES device (id),
    basket_id INT REFERENCES basket (id)
);

ALTER TABLE type1
ADD CONSTRAINT nameConstraint UNIQUE("name");

CREATE TABLE user_token(
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES user1(id),
    refreshToken VARCHAR(500)
);

