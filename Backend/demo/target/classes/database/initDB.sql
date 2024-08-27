CREATE TABLE IF NOT EXISTS persons
(
    id    BIGSERIAL PRIMARY KEY ,
    login  VARCHAR(100) NOT NULL ,
    password  VARCHAR(100) NOT NULL ,
    role  VARCHAR(100) NOT NULL ,
    sum  INT NOT NULL ,
    first_Name  VARCHAR(100) ,
    last_Name VARCHAR(100) ,
    average_Name VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS cfoes
(
    id    BIGSERIAL PRIMARY KEY ,
    cfo_name  VARCHAR(100) NOT NULL ,
    sum  INT NOT NULL ,
    owner_id    BIGSERIAL ,
    basic_sum  INT NOT NULL ,
    final_date  TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS transactions
(
    id    BIGSERIAL PRIMARY KEY ,
    t_from    BIGSERIAL,
    t_to    BIGSERIAL,
    owner    BIGSERIAL,
    sum  INT NOT NULL ,
    type  VARCHAR(100) NOT NULL ,
    comment  VARCHAR(100) NOT NULL ,
    datatime TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS all_id
(
    id    BIGSERIAL PRIMARY KEY ,
    type_id  VARCHAR(100) NOT NULL ,
    table_id    BIGSERIAL
);

