import asyncio
import logging
import os
from dotenv import load_dotenv
from asyncua import Server, ua

# Load environment variables
load_dotenv()

# Logging setup
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def run_milling_process(variables):
    print("🛠️ Starting milling process...")

    await variables["MoveOut"].set_value(True)
    print("MoveOut: True")
    await asyncio.sleep(2)

    await variables["MoveOut"].set_value(False)

    await variables["LowerRaise"].set_value(True)
    print("LowerRaise: True")
    await asyncio.sleep(3)

    await variables["LowerRaise"].set_value(False)

    await asyncio.sleep(3)

    await variables["MoveIn"].set_value(True)
    print("MoveIn: True")
    await asyncio.sleep(3)


    await variables["MoveIn"].set_value(False)



    await variables["LowerRaise"].set_value(True)
    print("LowerRaise: Down")
    await asyncio.sleep(3)

    await variables["LowerRaise"].set_value(False)
    await asyncio.sleep(2)

    await variables["ConveyorMilling"].set_value(True)
    print("ConveyorMilling: True")
    await asyncio.sleep(4)

    await variables["ConveyorMilling"].set_value(False)

    await asyncio.sleep(3)

    await variables["Spindle"].set_value(True)
    print("Spindle: ON")
    await asyncio.sleep(5)

    await variables["Spindle"].set_value(False)
    print("Spindle: OFF")

    await asyncio.sleep(2)




    await variables["ConveyorTransport"].set_value(True)
    print("ConveyorTransport: True")
    await asyncio.sleep(3)

    await variables["ConveyorTransport"].set_value(False)
    await asyncio.sleep(3)



    await variables["LowerRaise"].set_value(True)
    print("LowerRaise: True")
    await asyncio.sleep(3)


    await variables["LowerRaise"].set_value(False)
    print("LowerRaise: false")
    await asyncio.sleep(3)




    await variables["MoveOut"].set_value(True)
    print("MoveOut: True")
    await asyncio.sleep(2)



    await variables["MoveOut"].set_value(False)
    print("MoveOut: False")
    await asyncio.sleep(2)


    await variables["LowerRaise"].set_value(True)
    print("LowerRaise: True")
    await asyncio.sleep(3)


    await variables["LowerRaise"].set_value(False)
    print("LowerRaise: false")
    await asyncio.sleep(3)


    await variables["MoveIn"].set_value(True)
    print("MoveIn: True")
    await asyncio.sleep(2)

    await variables["MoveIn"].set_value(False)
    await asyncio.sleep(2)



    print("✅ Milling process finished.")

    # Reset all values
    for key in variables:
        await variables[key].set_value(False)



async def drop(variables):
    print("\U0001F4E6 Starting drop process...")



    await variables["ConveyorTransport"].set_value(True)
    print("ConveyorTransport: True")
    await asyncio.sleep(3)

    await variables["ConveyorTransport"].set_value(False)
    await asyncio.sleep(3)



    await variables["LowerRaise"].set_value(True)
    print("LowerRaise: True")
    await asyncio.sleep(3)


    await variables["LowerRaise"].set_value(False)
    print("LowerRaise: false")
    await asyncio.sleep(3)




    await variables["MoveOut"].set_value(True)
    print("MoveOut: True")
    await asyncio.sleep(2)



    await variables["MoveOut"].set_value(False)
    print("MoveOut: False")
    await asyncio.sleep(2)


    await variables["LowerRaise"].set_value(True)
    print("LowerRaise: True")
    await asyncio.sleep(3)


    await variables["LowerRaise"].set_value(False)
    print("LowerRaise: false")
    await asyncio.sleep(3)


    await variables["MoveIn"].set_value(True)
    print("MoveIn: True")
    await asyncio.sleep(2)

    await variables["MoveIn"].set_value(False)
    await asyncio.sleep(2)




async def pick(variables):
    print("🛠️ Starting milling process...")

    await variables["MoveOut"].set_value(True)
    print("MoveOut: True")
    await asyncio.sleep(2)

    await variables["MoveOut"].set_value(False)

    await variables["LowerRaise"].set_value(True)
    print("LowerRaise: True")
    await asyncio.sleep(3)

    await variables["LowerRaise"].set_value(False)

    await asyncio.sleep(3)

    await variables["MoveIn"].set_value(True)
    print("MoveIn: True")
    await asyncio.sleep(3)


    await variables["MoveIn"].set_value(False)



    await variables["LowerRaise"].set_value(True)
    print("LowerRaise: Down")
    await asyncio.sleep(3)

    await variables["LowerRaise"].set_value(False)
    await asyncio.sleep(2)

    await variables["ConveyorMilling"].set_value(True)
    print("ConveyorMilling: True")
    await asyncio.sleep(4)

    await variables["ConveyorMilling"].set_value(False)

    await asyncio.sleep(3)





async def mill(variables,duration):
    await variables["Spindle"].set_value(True)
    await asyncio.sleep(duration)
    await variables["Spindle"].set_value(False)


async def reset_nodes_to_default(node_dict: dict):
    await asyncio.sleep(3)
    for name, node in node_dict.items():
        try:
            val = await node.read_value()
            if isinstance(val, bool):
                await node.write_value(False)
        except Exception as e:
            print(f"⚠️ Failed to reset '{name}': {e}")





async def main():
    server = Server()
    await server.init()

    server.set_endpoint(os.getenv("OPCUA_ENDPOINT"))
    server.set_server_name(os.getenv("SERVER_NAME"))

    

    # Correct: Register and capture the namespace index dynamically
    uri = os.getenv("NAMESPACE_URI")
    idx = await server.register_namespace(uri)

    idx = 4
    logger.info(f"✅ Registered namespace URI '{uri}' with index {idx}")

    # === DEBUG DUMP ===
    print(f"🔍 Existing nodes under Objects for ns={idx}:")
    for child in await server.nodes.objects.get_children():
        nid = child.nodeid
        if nid.NamespaceIndex == idx:
            bn = await child.read_browse_name()
            print(f"    • NodeId={nid.Identifier}, BrowseName={bn.Name}")

    # now add your object and variables…


    objects = server.nodes.objects
    mill_station = await objects.add_object(ua.NodeId("MillStation", idx), "MillStation")

    def get_node_id(env_var):
        return ua.NodeId(int(os.getenv(env_var)), idx)

    variables = {
        "Spindle": await mill_station.add_variable(get_node_id("NODEID_FRASER"), "Spindle", False, ua.VariantType.Boolean),
        "MoveOut": await mill_station.add_variable(get_node_id("NODEID_RAUS"), "MoveOut", False, ua.VariantType.Boolean),
        "MoveIn": await mill_station.add_variable(get_node_id("NODEID_REIN"), "MoveIn", False, ua.VariantType.Boolean),
        "LowerRaise": await mill_station.add_variable(get_node_id("NODEID_RUNTER_HOCH"), "LowerRaise", False, ua.VariantType.Boolean),
        "ConveyorMilling": await mill_station.add_variable(get_node_id("NODEID_BAND_FRASER"), "ConveyorMilling", False, ua.VariantType.Boolean),
        "ConveyorTransport": await mill_station.add_variable(get_node_id("NODEID_BAND_FTS"), "ConveyorTransport", False, ua.VariantType.Boolean),
        "cmd__start_mill": await mill_station.add_variable(get_node_id("NODEID_CMD_START_MILL"), "cmd__start_mill", False, ua.VariantType.Boolean),
        "Operations_Finish": await mill_station.add_variable(get_node_id("NODEID_PROCESS_MILL_FINISH"), "Operations_Finish", False, ua.VariantType.Boolean),

    
        "mill_aktiv": await mill_station.add_variable(get_node_id("NODEID_MILL_AKTIV"), "MILL_aktiv", False, ua.VariantType.Boolean),
        "mill_finished": await mill_station.add_variable(get_node_id("NODEID_MILL_FINISHED"), "MILL_finished", False, ua.VariantType.Boolean),
        "drop_aktiv": await mill_station.add_variable(get_node_id("NODEID_DROP_AKTIV"), "drop_aktiv", False, ua.VariantType.Boolean),
        "drop_finished": await mill_station.add_variable(get_node_id("NODEID_DROP_FINISHED"), "drop_finished", False, ua.VariantType.Boolean),
        "pick_aktiv": await mill_station.add_variable(get_node_id("NODEID_PICK_AKTIV"), "pick_aktiv", False, ua.VariantType.Boolean),
        "pick_finished": await mill_station.add_variable(get_node_id("NODEID_PICK_FINISHED"), "pick_finished", False, ua.VariantType.Boolean),
        "mill_duration": await mill_station.add_variable(get_node_id("NODEID_MILL_DURATION"), "MILL_duration", 0, ua.VariantType.Int16)
    
    
    }

    serial_number_nodeid = ua.NodeId("SerialNumber", 3)
    serial_number = await mill_station.add_variable(serial_number_nodeid, "SerialNumber", "MILL001", ua.VariantType.String)
    model_nodeid = ua.NodeId(int(os.getenv("NODEID_MODEL")), idx)
    version_nodeid = ua.NodeId(int(os.getenv("NODEID_VERSION")), idx)
    model = await mill_station.add_variable(model_nodeid, "model", "MILL", ua.VariantType.String)
    version = await mill_station.add_variable(version_nodeid, "version", "v1.0", ua.VariantType.String)

    await serial_number.set_writable()
    await model.set_writable()
    await version.set_writable()

    variables["SerialNumber"] = serial_number
    variables["model"] = model
    variables["version"] = version


    for name, var in variables.items():
        await var.set_writable()
        logger.info(f"Created variable '{name}' with NodeId: {var.nodeid}")

    print(f"✅ OPC UA Server started at {os.getenv('OPCUA_ENDPOINT')}")

    async with server:
        try:
            while True:
                if await variables["cmd__start_mill"].get_value():
                    await run_milling_process(variables)
                    await variables["cmd__start_mill"].set_value(False)
                    await variables["Operations_Finish"].set_value(True)
                    await asyncio.sleep(2)
                    await variables["Operations_Finish"].set_value(False)

                if await variables["pick_aktiv"].get_value():
                    await pick(variables)
                    await variables["pick_aktiv"].set_value(False)
                    await variables["pick_finished"].set_value(True)
                
                if await variables["drop_aktiv"].get_value() :
                    await drop(variables)
                    await variables["drop_aktiv"].set_value(False)
                    await variables["drop_finished"].set_value(True)
                    await reset_nodes_to_default(variables)


                mill_aktiv_value = await variables["mill_aktiv"].get_value()
                mill_duration_value = await variables["mill_duration"].get_value()

                if mill_aktiv_value and mill_duration_value > 0:
                    print("Starting drill process")
                    print(mill_duration_value)
                    await mill(variables,mill_duration_value)
                    await variables["mill_aktiv"].set_value(False)
                    await variables["mill_finished"].set_value(True)
                await asyncio.sleep(1)
        except asyncio.CancelledError:
            logger.info("🛑 Server stopped")
        except Exception as e:
            logger.error(f"❌ Server error: {e}")

if __name__ == "__main__":
    asyncio.run(main())
