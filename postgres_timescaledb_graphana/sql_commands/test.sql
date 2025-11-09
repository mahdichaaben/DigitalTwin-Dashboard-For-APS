DROP TABLE IF EXISTS test_sensor;

CREATE TABLE test_sensor (
    id SERIAL,
    module TEXT NOT NULL,
    sensor_type TEXT NOT NULL,
    value DOUBLE PRECISION NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (id, timestamp)
);

SELECT create_hypertable('test_sensor', 'timestamp', if_not_exists => TRUE);