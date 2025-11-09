-- Drop table if exists to recreate fresh
DROP TABLE IF EXISTS drill_state;

-- Create the drill_state table
CREATE TABLE drill_state (
    id SERIAL PRIMARY KEY,
    serialNumber VARCHAR(50) NOT NULL,
    actionId VARCHAR(50),
    actionCommand VARCHAR(50),
    actionState VARCHAR(50),
    moduleState VARCHAR(50),
    opcuaState VARCHAR(50),
    orderId VARCHAR(50),
    orderUpdateId INTEGER,
    headerId INTEGER,
    paused BOOLEAN,
    errors JSONB,
    metadata JSONB,
    topic TEXT,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create hypertable on timestamp column (if not exists)
SELECT create_hypertable('drill_state', 'timestamp', if_not_exists => TRUE);
