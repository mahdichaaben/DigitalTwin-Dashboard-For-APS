DROP TABLE IF EXISTS aiqs_state;

CREATE TABLE aiqs_state (
    id SERIAL,
    serialNumber TEXT NOT NULL,

    actionCommand TEXT,
    actionState TEXT,
    actionResult TEXT,
    actionType TEXT,

    moduleState TEXT,
    opcuaState TEXT,
    
    orderId TEXT,
    orderUpdateId INTEGER,
    headerId INTEGER,

    loadType TEXT,

    error TEXT,
    paused BOOLEAN,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),

    PRIMARY KEY (id, timestamp)
);

-- Create TimescaleDB hypertable (safe even if it already exists)
SELECT create_hypertable('aiqs_state', 'timestamp', if_not_exists => TRUE);
