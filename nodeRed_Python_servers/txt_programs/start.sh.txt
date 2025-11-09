#!/bin/bash

echo "🚀 Starting all MQTT scripts in parallel..."

# Start all scripts in background
python txt_agv.py &
python txt_ai.py &
python txt_dps.py &

# Wait for all background jobs
wait
