CREATE DATABASE medical_db;

use DATABASE medical_db;

CREATE TABLE IF NOT EXISTS patients (
    id SERIAL PRIMARY KEY,
    name VARCHAR,
    dob DATE,
    ssn VARCHAR UNIQUE,
    medical_conditions TEXT,
    insurance_number VARCHAR,
    embedding JSONB
);