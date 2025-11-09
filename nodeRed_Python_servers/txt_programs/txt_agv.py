import json
import asyncio
import copy
from datetime import datetime, timezone
import paho.mqtt.client as mqtt
import os

# MQTT Config
BROKER = os.getenv("BROKER", "mosquitto")
PORT = int(os.getenv("PORT", "1883"))

TOPIC_ORDER_LISTEN = "fts/v1/ff/80F4/order"
TOPIC_ORDER_SEND = "fts/v1/ff/80F4/state"

message_queue = asyncio.Queue()

# MQTT Connect callback
def on_connect(client, userdata, flags, rc, properties=None):
    print(f"✅ Connected to broker with result code {rc}")
    client.subscribe(TOPIC_ORDER_LISTEN, qos=1)

# Helper: Current timestamp in ISO 8601
def current_timestamp():
    return datetime.now(timezone.utc).isoformat()

async def process_order(client, data: dict):
    """Simulate order processing with running → finished states."""
    edges = data.get("edges", [])
    delay = len(edges) * 6 if edges else 8
    print(f"⏳ Processing time: {delay} seconds")

    # Step 1: Running
    running_data = copy.deepcopy(data)
    running_data["timestamp"] = current_timestamp()
    running_data.setdefault("actionState", {})["state"] = "running"

    res = client.publish(TOPIC_ORDER_SEND, json.dumps(running_data), qos=1)
    if res.rc == mqtt.MQTT_ERR_SUCCESS:
        print(f"🚀 Published 'running' → {json.dumps(running_data, indent=2)}")
    else:
        print(f"⚠️ Failed to publish running state (rc={res.rc})")

    await asyncio.sleep(delay)

    # Step 2: Finished
    finished_data = copy.deepcopy(data)
    finished_data["timestamp"] = current_timestamp()
    finished_data.setdefault("actionState", {})["state"] = "finished"

    res = client.publish(TOPIC_ORDER_SEND, json.dumps(finished_data), qos=1)
    if res.rc == mqtt.MQTT_ERR_SUCCESS:
        print(f"✅ Published 'finished' → {json.dumps(finished_data, indent=2)}")
    else:
        print(f"⚠️ Failed to publish finished state (rc={res.rc})")

# Async message handler
async def handle_message(client):
    while True:
        msg = await message_queue.get()
        try:
            data = json.loads(msg.payload.decode())
            print(f"\n📩 Received on topic: {msg.topic}")
            print(f"→ Original payload: {json.dumps(data, indent=2)}")

            if msg.topic == TOPIC_ORDER_LISTEN:
                await process_order(client, data)
            else:
                print("ℹ️ Ignored message from other topic.")
        except Exception as e:
            print(f"❌ Error processing message: {e}")

async def main():
    loop = asyncio.get_running_loop()
    client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)
    client.on_connect = on_connect

    def on_message(client, userdata, msg):
        asyncio.run_coroutine_threadsafe(message_queue.put(msg), loop)

    client.on_message = on_message
    client.connect(BROKER, PORT, keepalive=60)
    client.loop_start()

    try:
        await handle_message(client)
    except asyncio.CancelledError:
        print("🛑 Handler stopped.")
    finally:
        client.loop_stop()
        client.disconnect()

if __name__ == "__main__":
    asyncio.run(main())
