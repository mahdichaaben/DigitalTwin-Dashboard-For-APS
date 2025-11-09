-- Drop all tables if they exist (cascade removes dependencies)
DROP TABLE IF EXISTS public.sensor_ CASCADE;
DROP TABLE IF EXISTS public.state_ CASCADE;
DROP TABLE IF EXISTS public.station_ CASCADE;

-- Create Station table (static metadata)
CREATE TABLE public.station_ (
    serial_number TEXT PRIMARY KEY,
    ip_address TEXT NOT NULL,
    model TEXT NOT NULL,
    version TEXT,
    manufacturer TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Create State table (hypertable)
CREATE TABLE public.state_ (
    serial_number TEXT NOT NULL,
    module_state TEXT NOT NULL,
    opcua_state TEXT,
    connection_state TEXT,
    action_state TEXT,
    order_id TEXT,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
    errors TEXT[],
    PRIMARY KEY (serial_number, timestamp),
    FOREIGN KEY (serial_number) REFERENCES public.station_(serial_number) ON DELETE CASCADE
);

-- Convert state to hypertable
SELECT create_hypertable('state_', 'timestamp', if_not_exists => TRUE);

-- Create Sensor table (hypertable)
CREATE TABLE public.sensor_ (
    sensor_id TEXT NOT NULL,
    serial_number TEXT NOT NULL,
    sensor_type TEXT NOT NULL,
    value DOUBLE PRECISION NOT NULL,
    unit TEXT NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (sensor_id, timestamp),
    FOREIGN KEY (serial_number) REFERENCES public.station_(serial_number) ON DELETE CASCADE
);

-- Convert sensor to hypertable
SELECT create_hypertable('sensor_', 'timestamp', if_not_exists => TRUE);

-- Optional index for filtering by sensor_id
CREATE INDEX IF NOT EXISTS idx_sensor_id ON public.sensor_(sensor_id);





INSERT INTO station_ (serial_number, ip_address, model, version, manufacturer) VALUES
  ('DRILL001', 'drill', 'DRILL', 'v1.0', 'Fischertechnik'),
  ('MILL001',  'mill',  'MILL',  'v1.0', 'Fischertechnik'),
  ('AIQS001',  'quality', 'AIQS', 'v1.0', 'Fischertechnik'),
  ('DPS001',   'dps',   'DPS',   'v1.0', 'Fischertechnik'),
  ('HBW001',   'hbw',   'HBW',   'v1.0', 'Fischertechnik');



  
