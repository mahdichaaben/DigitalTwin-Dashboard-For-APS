import json
import asyncio
from datetime import datetime, timezone
import paho.mqtt.client as mqtt

MQTT_BROKER = "localhost"
MQTT_PORT = 1883
COMMANDS_FILE = "StoreCommands.json"

message_queue = asyncio.Queue()

def current_timestamp():
    return datetime.now(timezone.utc).isoformat()

def is_finished_state(payload):
    action_state = payload.get("actionState", {})
    state = action_state.get("state", "").lower()
    return state == "finished"

def on_connect(client, userdata, flags, rc):
    print(f"✅ Connected to MQTT broker with result code {rc}")

async def wait_for_finish_state(expected_topic, min_timestamp_iso):
    min_timestamp = datetime.fromisoformat(min_timestamp_iso)
    while True:
        msg = await message_queue.get()
        if msg.topic != expected_topic:
            continue
        try:
            payload = json.loads(msg.payload.decode())
        except Exception as e:
            print(f"Failed to decode JSON from topic {msg.topic}: {e}")
            continue

        msg_timestamp_str = payload.get("timestamp")
        if msg_timestamp_str is None:
            print(f"No timestamp in payload from {msg.topic}, ignoring message.")
            continue

        try:
            # Normalize 'Z' suffix to '+00:00' for fromisoformat
            normalized_timestamp = msg_timestamp_str.replace('Z', '+00:00')
            msg_timestamp = datetime.fromisoformat(normalized_timestamp)
        except Exception as e:
            print(f"Failed to parse timestamp {msg_timestamp_str} from {msg.topic}: {e}")
            continue

        if msg_timestamp < min_timestamp:
            print(f"Ignoring old message with timestamp {msg_timestamp_str} from {msg.topic}")
            continue

        print(f"Received message on {msg.topic}: {payload}")

        if is_finished_state(payload):
            print(f"Received finished state on topic {msg.topic}")
            return

async def send_commands(client, commands):
    for idx, cmd in enumerate(commands):
        publish_topic = cmd['topic']
        if publish_topic.endswith("order"):
            expected_state_topic = publish_topic[:-len("order")] + "state"
        else:
            expected_state_topic = publish_topic

        # Subscribe only to the needed state topic
        client.subscribe(expected_state_topic)
        print(f"Subscribed to state topic: {expected_state_topic}")

        # Add/update timestamp
        cmd['payload']['timestamp'] = current_timestamp()
        payload_str = json.dumps(cmd['payload'])

        print(f"[{current_timestamp()}] Publishing command {idx} to topic {publish_topic}: {payload_str}")
        client.publish(publish_topic, payload_str)

        # Pass the timestamp of the command to wait_for_finish_state
        await wait_for_finish_state(expected_state_topic, cmd['payload']['timestamp'])
        print(f"Command {idx} finished.\n")

        # Unsubscribe after finishing listening for the command
        client.unsubscribe(expected_state_topic)
        print(f"Unsubscribed from state topic: {expected_state_topic}")

async def main():
    with open(COMMANDS_FILE, 'r') as f:
        commands = json.load(f)

    loop = asyncio.get_running_loop()
    client = mqtt.Client()
    client.on_connect = on_connect

    def on_message(client, userdata, msg):
        asyncio.run_coroutine_threadsafe(message_queue.put(msg), loop)

    client.on_message = on_message

    client.connect(MQTT_BROKER, MQTT_PORT, 60)
    client.loop_start()

    try:
        await send_commands(client, commands)
    finally:
        client.loop_stop()
        client.disconnect()
        print("Disconnected from MQTT broker.")

if __name__ == "__main__":
    asyncio.run(main())
