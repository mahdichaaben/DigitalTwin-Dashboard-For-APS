import json
import asyncio
from datetime import datetime, timezone
import paho.mqtt.client as mqtt

MQTT_BROKER = "localhost"
MQTT_PORT = 1883
ALL_COMMANDS_FILE = "AllCommands.json"
START_COMMANDS_FILE = "Start.json"

message_queue = asyncio.Queue()

# Hard-coded path dictionary mapping station pairs to path identifiers
PATH_DICTIONARY = {
    # DPS paths
    "DPS-HBW": "SVR4PW6408-SVR5H85409",
    "DPS-DRILL": "SVR4PW6408-SVR5H85384",
    "DPS-MILL": "SVR4PW6408-SVR5H59286",
    "DPS-AIQS": "SVR4PW6408-SVR4LR8731",
    
    # HBW paths
    "HBW-DPS": "SVR5H85409-SVR4PW6408",
    "HBW-DRILL": "SVR5H85409-SVR5H85384",
    "HBW-MILL": "SVR5H85409-SVR5H59286",
    "HBW-AIQS": "SVR5H85409-SVR4LR8731",
    
    # DRILL paths
    "DRILL-DPS": "SVR5H85384-SVR4PW6408",
    "DRILL-HBW": "SVR5H85384-SVR5H85409",
    "DRILL-MILL": "SVR5H85384-SVR5H59286",
    "DRILL-AIQS": "SVR5H85384-SVR4LR8731",
    
    # MILL paths
    "MILL-DPS": "SVR5H59286-SVR4PW6408",
    "MILL-HBW": "SVR5H59286-SVR5H85409",
    "MILL-DRILL": "SVR5H59286-SVR5H85384",
    "MILL-AIQS": "SVR5H59286-SVR4LR8731",
    
    # AIQS paths
    "AIQS-DPS": "SVR4LR8731-SVR4PW6408",
    "AIQS-HBW": "SVR4LR8731-SVR5H85409",
    "AIQS-DRILL": "SVR4LR8731-SVR5H85384",
    "AIQS-MILL": "SVR4LR8731-SVR5H59286",
}

# Hard-coded sequence of stations to visit
STATION_SEQUENCE = ["DPS","MILL","DPS"]

def current_timestamp():
    return datetime.now(timezone.utc).isoformat()

def is_finished_state(payload):
    action_state = payload.get("actionState", {})
    state = action_state.get("state", "").lower()
    return state == "finished"

def on_connect(client, userdata, flags, rc):
    print(f"✅ Connected to MQTT broker with result code {rc}")

def find_command_by_path(commands, path_key):
    """Find command in the commands list that matches the given path key"""
    for cmd in commands:
        if cmd.get("path") == path_key:
            return cmd
    return None

def generate_path_sequence(station_sequence):
    """Generate path keys from station sequence"""
    paths = []
    for i in range(len(station_sequence) - 1):
        from_station = station_sequence[i]
        to_station = station_sequence[i + 1]
        path_key = f"{from_station}-{to_station}"
        paths.append(path_key)
    return paths

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

async def send_path_command(client, command, path_name):
    """Send a single path command and wait for completion"""
    publish_topic = command['topic']
    if publish_topic.endswith("order"):
        expected_state_topic = publish_topic[:-len("order")] + "state"
    else:
        expected_state_topic = publish_topic

    # Subscribe only to the needed state topic
    client.subscribe(expected_state_topic)
    print(f"Subscribed to state topic: {expected_state_topic}")

    # Add/update timestamp
    command['payload']['timestamp'] = current_timestamp()
    payload_str = json.dumps(command['payload'])

    print(f"🚀 [{current_timestamp()}] Executing path: {path_name}")
    print(f"📤 Publishing to topic {publish_topic}: {command['payload']['description']}")
    client.publish(publish_topic, payload_str)

    # Wait for command completion
    await wait_for_finish_state(expected_state_topic, command['payload']['timestamp'])
    print(f"✅ Path {path_name} completed.\n")

    # Unsubscribe after finishing
    client.unsubscribe(expected_state_topic)
    print(f"Unsubscribed from state topic: {expected_state_topic}")

async def send_start_commands(client, start_commands):
    """Send initialization commands before starting the journey"""
    print("🚀 Executing start commands...")
    
    for idx, cmd in enumerate(start_commands):
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

        print(f"📤 [{current_timestamp()}] Start command {idx + 1}: {cmd['payload'].get('description', 'Initialization')}")
        client.publish(publish_topic, payload_str)

        # Pass the timestamp of the command to wait_for_finish_state
        await wait_for_finish_state(expected_state_topic, cmd['payload']['timestamp'])
        print(f"✅ Start command {idx + 1} finished.\n")

        # Unsubscribe after finishing listening for the command
        client.unsubscribe(expected_state_topic)
        print(f"Unsubscribed from state topic: {expected_state_topic}")
    
    print("✅ All start commands completed!\n")

async def execute_station_sequence(client, all_commands, station_sequence):
    """Execute the complete station sequence"""
    print(f"🎯 Starting AGV journey: {' → '.join(station_sequence)}")
    
    # Generate path sequence from station sequence
    path_sequence = generate_path_sequence(station_sequence)
    
    for idx, path_name in enumerate(path_sequence):
        print(f"\n📍 Step {idx + 1}: Moving from {path_name.split('-')[0]} to {path_name.split('-')[1]}")
        
        # Get path identifier from dictionary
        path_identifier = PATH_DICTIONARY.get(path_name)
        if not path_identifier:
            print(f"❌ Error: Path {path_name} not found in PATH_DICTIONARY")
            continue
        
        # Find command with matching path
        command = find_command_by_path(all_commands, path_identifier)
        if not command:
            print(f"❌ Error: No command found for path identifier {path_identifier}")
            continue
        
        # Send command and wait for completion
        await send_path_command(client, command, path_name)
    
    print("🏁 AGV journey completed successfully!")

async def main():
    # Load all commands from file
    try:
        with open(ALL_COMMANDS_FILE, 'r') as f:
            all_commands = json.load(f)
        print(f"📁 Loaded {len(all_commands)} commands from {ALL_COMMANDS_FILE}")
    except FileNotFoundError:
        print(f"❌ Error: File {ALL_COMMANDS_FILE} not found")
        return
    except json.JSONDecodeError as e:
        print(f"❌ Error: Invalid JSON in {ALL_COMMANDS_FILE}: {e}")
        return

    # Load start commands from file
    try:
        with open(START_COMMANDS_FILE, 'r') as f:
            start_commands = json.load(f)
        print(f"🏁 Loaded {len(start_commands)} start commands from {START_COMMANDS_FILE}")
    except FileNotFoundError:
        print(f"❌ Error: File {START_COMMANDS_FILE} not found")
        return
    except json.JSONDecodeError as e:
        print(f"❌ Error: Invalid JSON in {START_COMMANDS_FILE}: {e}")
        return

    # Setup MQTT client
    loop = asyncio.get_running_loop()
    client = mqtt.Client()
    client.on_connect = on_connect

    def on_message(client, userdata, msg):
        asyncio.run_coroutine_threadsafe(message_queue.put(msg), loop)

    client.on_message = on_message

    # Connect to MQTT broker
    try:
        client.connect(MQTT_BROKER, MQTT_PORT, 60)
        client.loop_start()
        
        # Execute start commands first
        await send_start_commands(client, start_commands)
        
        # Execute the station sequence
        await execute_station_sequence(client, all_commands, STATION_SEQUENCE)
        
    except Exception as e:
        print(f"❌ Error during execution: {e}")
    finally:
        client.loop_stop()
        client.disconnect()
        print("🔌 Disconnected from MQTT broker.")

if __name__ == "__main__":
    print("🤖 Enhanced AGV Command Sender Starting...")
    print(f"🗺️  Path Dictionary: {len(PATH_DICTIONARY)} paths loaded")
    print(f"📋 Station Sequence: {' → '.join(STATION_SEQUENCE)}")
    print(f"🏁 Start commands will be executed first")
    print("-" * 50)
    asyncio.run(main())