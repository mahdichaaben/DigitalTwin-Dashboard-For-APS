import json
import asyncio
import paho.mqtt.client as mqtt
from datetime import datetime, timezone
import os
import copy

# MQTT Config
BROKER = os.getenv("BROKER", "mosquitto")
PORT = int(os.getenv("PORT", "1883"))

TOPIC_ORDER_LISTEN = "module/v1/ff/NodeRed/SVR4PW6408/triggerorder"
TOPIC_ORDER_SEND = "module/v1/ff/NodeRed/SVR4PW6408/order"
TOPIC_STATE = "module/v1/ff/NodeRed/SVR4PW6408/state"

# Templates
payload_rgb_nfc = {
    "serialNumber": "SVR4PW6408",
    "orderId": "9da5c06d-2d1d-4312-a49a-ec7d72f4243c",
    "orderUpdateId": 1,
    "action": {"command": "RGB_NFC", "metadata": {"type": "BLUE"}},
}

payload_input_rgb = {
    "orderId": "0ed8e450-4348-4dfd-8e6a-74eb535c135b",
    "orderUpdateId": 1,
    "action": {
        "id": "0ed8e450-4348-4dfd-8e6a-74eb535c135b",
        "command": "INPUT_RGB",
        "metadata": {},
    },
}

payload_drop = {
    "serialNumber": "SVR4PW6408",
    "orderId": "9da5c06d-2d1d-4312-a49a-ec7d72f4243c",
    "orderUpdateId": 1,
    "action": {
        "id": "b2496c1a-60f1-4fc6-9ec2-03c4c6be67ab",
        "command": "DROP",
        "metadata": {
            "workpiece": {
                "workpieceId": "043169ca341290",
                "type": "BLUE",
                "history": [],
                "state": "PROCESSED",
            }
        },
    },
}

payload_pick_process = {
    "serialNumber": "SVR4PW6408",
    "orderId": "9da5c06d-2d1d-4312-a49a-ec7d72f4243c",
    "orderUpdateId": 1,
    "action": {
        "id": "b2496c1a-60f1-4fc6-9ec2-03c4c6be67ab",
        "command": "PICK",
        "metadata": {
            "workpiece": {
                "workpieceId": "043169ca341290",
                "type": "BLUE",
                "history": [],
                "state": "PROCESSED",
            }
        },
    },
}

message_queue = asyncio.Queue()


def current_timestamp():
    """ISO 8601 UTC timestamp"""
    return datetime.now(timezone.utc).isoformat()


# MQTT connect callback (API v2 signature)
def on_connect(client, userdata, flags, rc, properties=None):
    print(f"✅ Connected to broker with result code {rc}")
    client.subscribe(TOPIC_ORDER_LISTEN)


async def handle_message(client):
    while True:
        msg = await message_queue.get()
        try:
            data = json.loads(msg.payload.decode())
            command = data.get("action", {}).get("command", "")

            print(f"\n📩 Received on {msg.topic}")
            print(f"→ Command: {command}")

            if msg.topic == TOPIC_ORDER_LISTEN:
                if command == "DROP":
                    print("⚙️ Handling DROP PROCESS...")

                    # Step 1: INPUT_RGB
                    p1 = copy.deepcopy(payload_input_rgb)
                    p1["timestamp"] = current_timestamp()
                    client.publish(TOPIC_ORDER_SEND, json.dumps(p1), qos=1)
                    print("✅ Sent INPUT_RGB")
                    await asyncio.sleep(5)

                    # Step 2: RGB_NFC
                    p2 = copy.deepcopy(payload_rgb_nfc)
                    p2["timestamp"] = current_timestamp()
                    client.publish(TOPIC_ORDER_SEND, json.dumps(p2), qos=1)
                    print("✅ Sent RGB_NFC")
                    await asyncio.sleep(5)

                    # Step 3: DROP
                    p3 = copy.deepcopy(payload_drop)
                    p3["timestamp"] = current_timestamp()
                    client.publish(TOPIC_ORDER_SEND, json.dumps(p3), qos=1)
                    print("✅ Sent DROP")
                    await asyncio.sleep(17)

                    # Step 4: DROP FINISHED state
                    state_finished = {
                        "timestamp": current_timestamp(),
                        "serialNumber": "SVR4PW6408",
                        "orderId": data.get("orderId"),
                        "orderUpdateId": data.get("orderUpdateId"),
                        "action": {"command": "DROP", "state": "FINISHED"},
                    }
                    client.publish(TOPIC_STATE, json.dumps(state_finished), qos=1)
                    print("✅ Sent DROP FINISHED")

                elif command == "PICK":
                    print("⚙️ Handling PICK PROCESS...")

                    p4 = copy.deepcopy(payload_pick_process)
                    p4["timestamp"] = current_timestamp()
                    client.publish(TOPIC_ORDER_SEND, json.dumps(p4), qos=1, retain=True)
                    print("✅ Sent retained PICK")
                    await asyncio.sleep(16)

                    state_finished = {
                        "timestamp": current_timestamp(),
                        "serialNumber": "SVR4PW6408",
                        "orderId": data.get("orderId"),
                        "orderUpdateId": data.get("orderUpdateId"),
                        "action": {"command": "PICK", "state": "FINISHED"},
                    }
                    client.publish(TOPIC_STATE, json.dumps(state_finished), qos=1)
                    print("✅ Sent PICK FINISHED")

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
    client.connect(BROKER, PORT, 60)
    client.loop_start()

    try:
        await handle_message(client)
    finally:
        client.loop_stop()
        client.disconnect()


if __name__ == "__main__":
    asyncio.run(main())
