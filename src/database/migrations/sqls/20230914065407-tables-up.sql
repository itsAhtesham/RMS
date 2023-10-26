/* Replace with your SQL commands */
create table users(
    id SERIAL PRIMARY KEY,
    name varchar(30) NOT NULL,
    email varchar(50) unique NOT NULL,
    password varchar(60) NOT NULL,
    createdBy INT,
    createdAt TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    archivedAt TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    FOREIGN KEY(createdBy) REFERENCES users(id) ON DELETE CASCADE
);

create table address(
    id SERIAL PRIMARY KEY,
    name varchar(30) NOT NULL,
    latitude float4 NOT NULL ,
    longitude float4 NOT NULL ,
    userID INT,
    createdAt TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    archivedAt TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    FOREIGN KEY(userID) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TYPE role_t AS ENUM ('admin', 'subadmin', 'user');

create table roles(
    id SERIAL PRIMARY KEY,
    role role_t NOT NULL ,
    createdAt TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    archivedAt TIMESTAMP WITH TIME ZONE DEFAULT NULL
);

create table user_roles(
    id SERIAL PRIMARY KEY,
    userID INT,
    roleID INT,
    createdAt TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    archivedAt TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    FOREIGN KEY(userID) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY(roleID) REFERENCES roles(id) ON DELETE CASCADE
);

create table restaurants(
    id SERIAL PRIMARY KEY,
    name varchar(30) NOT NULL,
    latitude float4 NOT NULL ,
    longitude float4 NOT NULL ,
    createdBy INT,
    createdAt TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    archivedAt TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    FOREIGN KEY (createdBy) REFERENCES users(id) ON DELETE CASCADE,
    unique (latitude, longitude)
);

create table dishes(
    id SERIAL PRIMARY KEY,
    name varchar(30) NOT NULL,
    price float4 NOT NULL,
    restID INT,
    createdBy INT,
    createdAt TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    archivedAt TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    FOREIGN KEY (createdBy) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (restID) REFERENCES restaurants(id) ON DELETE CASCADE
);

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

create table sessions(
    id uuid DEFAULT uuid_generate_v4() NOT NULL PRIMARY KEY,
    userID INT,
    createdAt TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    archivedAt TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    FOREIGN KEY (userID) REFERENCES users(id) ON DELETE CASCADE
);