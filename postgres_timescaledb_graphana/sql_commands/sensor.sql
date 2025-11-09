-- Drop if exists
DROP TABLE IF EXISTS public.sensor;

-- Create with composite primary key
CREATE TABLE public.sensor (
    sensor_id TEXT NOT NULL,
    sensor_type TEXT NOT NULL,
    value DOUBLE PRECISION NOT NULL,
    unit TEXT NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (sensor_id, timestamp)
);

-- Convert to hypertable
SELECT create_hypertable('sensor', 'timestamp', if_not_exists => TRUE);

-- Optional: index for faster filtering by sensor_id
CREATE INDEX IF NOT EXISTS idx_sensor_id ON public.sensor(sensor_id);
