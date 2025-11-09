DROP TABLE IF EXISTS mill_state;

CREATE TABLE mill_state (
    id SERIAL,
    serialNumber TEXT NOT NULL,
    actionId TEXT,
    actionCommand TEXT,
    actionState TEXT,
    moduleState TEXT,
    opcuaState TEXT,
    orderId TEXT,
    orderUpdateId INTEGER,
    headerId INTEGER,
    paused BOOLEAN,
    errors JSONB,
    metadata JSONB,
    topic TEXT,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (id, timestamp)  -- composite primary key including timestamp
);

SELECT create_hypertable('mill_state', 'timestamp', if_not_exists => TRUE);
