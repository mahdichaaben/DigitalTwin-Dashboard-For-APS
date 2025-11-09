DROP TABLE IF EXISTS dps_state;

CREATE TABLE dps_state (
    id SERIAL,
    serialNumber TEXT NOT NULL,
    actionCommand TEXT,
    actionState TEXT,
    rackPosition TEXT,
    moduleState TEXT,
    opcuaState TEXT,
    orderState TEXT,
    orderId TEXT,
    orderUpdateId INTEGER,
    headerId INTEGER,
    error TEXT,
    paused BOOLEAN,
    type TEXT,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),

    PRIMARY KEY (id, timestamp)
);

SELECT create_hypertable('dps_state', 'timestamp', if_not_exists => TRUE);
