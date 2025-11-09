import json
import asyncio
from datetime import datetime, timezone
import paho.mqtt.client as mqtt

# Config
BROKER = "localhost"
PORT = 1883
TOPIC_STATE = "module/v1/ff/DRILL001/state"
TOPIC_ORDER = "module/v1/ff/DRILL001/order"
ORDERS_FILE = "orders.json"
SERIAL_NUMBER = "DRILL001"

message_queue = asyncio.Queue()
orders = []
current_index = 0
current_action_id = None

def current_timestamp():
    return datetime.now(timezone.utc).isoformat()

# MQTT callbacks
def on_connect(client, userdata, flags, rc):
    print(f"✅ Connected to broker with result code {rc}")
    client.subscribe(TOPIC_STATE)

def on_message(client, userdata, msg):
    asyncio.run_coroutine_threadsafe(message_queue.put(msg), asyncio.get_event_loop())

async def handle_state_messages(client):
    global current_index, current_action_id

    while True:
        msg = await message_queue.get()
        try:
            data = json.loads(msg.payload.decode())
            print(f"\n📩 Received state on topic: {msg.topic}")
            print(json.dumps(data, indent=2))

            action_state = data.get("actionState", {})
            if action_state.get("id") == current_action_id and action_state.get("state") == "FINISHED":
                print(f"✅ Action {current_action_id} is FINISHED.")
                current_index += 1
                await publish_next_order(client)

        except Exception as e:
            print(f"❌ Error handling message: {e}")

async def publish_next_order(client):
    global current_index, current_action_id

    if current_index >= len(orders):
        print("🏁 All orders completed.")
        client.disconnect()
        return

    order = orders[current_index]
    order["serialNumber"] = SERIAL_NUMBER
    order["timestamp"] = current_timestamp()
    current_action_id = order["action"]["id"]

    print(f"🚀 Publishing order {current_action_id}")
    client.publish(TOPIC_ORDER, json.dumps(order), qos=1)

async def main():
    global orders

    # Load orders
    with open(ORDERS_FILE, "r") as f:
        orders = json.load(f)

    # Setup MQTT
    client = mqtt.Client()
    client.on_connect = on_connect
    client.on_message = on_message
    client.connect(BROKER, PORT, 60)
    client.loop_start()

    # Start listening
    await asyncio.sleep(1)
    await publish_next_order(client)
    await handle_state_messages(client)

if __name__ == "__main__":
    asyncio.run(main())
