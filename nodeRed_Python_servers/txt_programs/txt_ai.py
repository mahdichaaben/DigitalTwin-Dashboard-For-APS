import json
import asyncio
import paho.mqtt.client as mqtt
from datetime import datetime, timezone
import os
import copy

# MQTT Config
BROKER = os.getenv("BROKER", "mosquitto")
PORT = int(os.getenv("PORT", "1883"))

TOPIC_ORDER_LISTEN = "module/v1/ff/NodeRed/AIQS001/order"
TOPIC_STATE_SEND = "module/v1/ff/NodeRed/AIQS001/state"

SEND_GOOD_RESULT = True

payload_running = {
    "serialNumber": "AIQS001",
    "orderId": "0",
    "orderUpdateId": 3,
    "actionState": {
        "id": "action-0001",
        "state": "running",
        "command": "CHECK_QUALITY"
    }
}

payload_good = {
    "serialNumber": "AIQS001",
    "orderId": "0",
    "orderUpdateId": 3,
    "actionState": {
        "id": "action-0001",
        "result": "PASSED",
        "state": "FINISHED",
        "command": "CHECK_QUALITY"
    }
}

payload_bad = {
    "serialNumber": "AIQS001",
    "orderId": "0",
    "orderUpdateId": 3,
    "actionState": {
        "id": "action-0001",
        "result": "FAILED",
        "state": "FINISHED",
        "command": "CHECK_QUALITY"
    }
}

message_queue = asyncio.Queue()


# MQTT connect callback
def on_connect(client, userdata, flags, rc, properties=None):
    print(f"✅ Connected to broker with result code {rc}")
    client.subscribe(TOPIC_ORDER_LISTEN)


def current_timestamp():
    return datetime.now(timezone.utc).isoformat()


# Message handler
async def handle_message(client):
    while True:
        msg = await message_queue.get()
        try:
            data = json.loads(msg.payload.decode())
            command = data.get("action", {}).get("command", "")
            print(f"\n📩 Received on topic: {msg.topic}")
            print(f"→ Command: {command}")

            # send RUNNING
            running_data = copy.deepcopy(payload_running)
            running_data["timestamp"] = current_timestamp()
            client.publish(TOPIC_STATE_SEND, json.dumps(running_data), qos=1)
            print(f"📤 Sent RUNNING state")

            await asyncio.sleep(5)

            # send FINISHED (GOOD or BAD)
            if SEND_GOOD_RESULT:
                good_data = copy.deepcopy(payload_good)
                good_data["timestamp"] = current_timestamp()
                client.publish(TOPIC_STATE_SEND, json.dumps(good_data), qos=1)
                print(f"✅ Sent GOOD state: {good_data['actionState']['result']}")
            else:
                bad_data = copy.deepcopy(payload_bad)
                bad_data["timestamp"] = current_timestamp()
                client.publish(TOPIC_STATE_SEND, json.dumps(bad_data), qos=1)
                print(f"❌ Sent BAD state: {bad_data['actionState']['result']}")

        except Exception as e:
            print(f"❌ Error: {e}")


async def main():
    loop = asyncio.get_running_loop()
    client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)
    client.on_connect = on_connect

    def on_message(client, userdata, msg):
        asyncio.run_coroutine_threadsafe(message_queue.put(msg), loop)

    client.on_message = on_message
    client.connect(BROKER, PORT, 60)
    client.loop_start()

    try:
        await handle_message(client)
    finally:
        client.loop_stop()
        client.disconnect()


if __name__ == "__main__":
    asyncio.run(main())
