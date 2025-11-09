DROP TABLE IF EXISTS hbw_state;

CREATE TABLE hbw_state (
    id SERIAL,
    serialNumber TEXT NOT NULL,

    actionId TEXT,
    actionCommand TEXT,
    actionState TEXT,
    actionType TEXT,
    rackPosition TEXT,

    moduleState TEXT,
    opcuaState TEXT,

    orderId TEXT,
    orderUpdateId INTEGER,
    headerId INTEGER,

    error TEXT,
    paused BOOLEAN,
    topic TEXT,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),

    PRIMARY KEY (id, timestamp)
);

SELECT create_hypertable('hbw_state', 'timestamp', if_not_exists => TRUE);
