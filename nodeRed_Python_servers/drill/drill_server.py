import asyncio
import logging
import os
from dotenv import load_dotenv
from asyncua import Server, ua

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def run_drilling_process(variables):
    print("\U0001F529 Starting drilling process...")
    # Step 1
    await variables["out"].set_value(True)
    print("Drill Step 1: out = True")
    await asyncio.sleep(3)
    await variables["out"].set_value(False)

    # Step 2
    await variables["down"].set_value(True)
    print("Drill Step 2: down = True")
    await asyncio.sleep(3)
    await variables["down"].set_value(False)
    print("Drill Step 3: down = False")
    await asyncio.sleep(3)

    # Step 3
    await variables["in"].set_value(True)
    print("Drill Step 4: in = True")
    await asyncio.sleep(3)
    await variables["in"].set_value(False)

    # Step 4
    await variables["down"].set_value(True)
    print("Drill Step 5: down = True")
    await asyncio.sleep(3)
    await variables["down"].set_value(False)
    print("Drill Step 6: down = False")
    await asyncio.sleep(3)

    # Step 5
    await variables["drill_conveyor"].set_value(True)
    print("Drill Step 7: drill_conveyor = True")
    await asyncio.sleep(5)


    await variables["drill_conveyor"].set_value(False)
    print("Drill Step 10: drill_conveyor = False")
    await asyncio.sleep(5)

    # Step 6
    await variables["drill"].set_value(True)
    print("Drill Step 8: drill = True")
    await asyncio.sleep(10)

    # Step 7
    await variables["drill"].set_value(False)
    print("Drill Step 9: drill = False")
    await asyncio.sleep(5)

    # Step 8


    # Step 9
    await variables["fts_conveyor"].set_value(True)
    print("Drill Step 11: fts_conveyor = True")
    await asyncio.sleep(3)

    # Step 10
    await variables["down"].set_value(True)
    print("Drill Step 12: down = True")
    await asyncio.sleep(3)
    await variables["down"].set_value(False)
    print("Drill Step 13: down = False")
    await asyncio.sleep(3)

    # Step 11
    await variables["out"].set_value(True)
    print("Drill Step 14: out = True")
    await asyncio.sleep(3)
    await variables["out"].set_value(False)
    print("Drill Step 14: out = False")
    await asyncio.sleep(3)

    # Step 12
    await variables["down"].set_value(True)
    print("Drill Step 15: down = True")
    await asyncio.sleep(3)
    await variables["down"].set_value(False)
    print("Drill Step 15: down = False")
    await asyncio.sleep(3)

    # Step 13
    await variables["in"].set_value(True)
    print("Drill Step 16: in = True")
    await asyncio.sleep(3)
    await variables["in"].set_value(False)

    print("\u2705 Drilling process completed.")

    # Reset all boolean variables (except strings) to False
    for key in variables:
        if key not in ["SerialNumber", "model", "version","drill_duration"]:
            await variables[key].set_value(False)





async def drop(variables):
    print("\U0001F4E6 Starting pick process...")


    
    await variables["drop_aktiv"].set_value(True)
    print("Pick activated")

    # Step 9
    await variables["fts_conveyor"].set_value(True)
    print("Drill Step 11: fts_conveyor = True")
    await asyncio.sleep(3)

    # Step 10
    await variables["down"].set_value(True)
    print("Drill Step 12: down = True")
    await asyncio.sleep(3)
    await variables["down"].set_value(False)
    print("Drill Step 13: down = False")
    await asyncio.sleep(3)

    # Step 11
    await variables["out"].set_value(True)
    print("Drill Step 14: out = True")
    await asyncio.sleep(3)
    await variables["out"].set_value(False)
    print("Drill Step 14: out = False")
    await asyncio.sleep(3)

    # Step 12
    await variables["down"].set_value(True)
    print("Drill Step 15: down = True")
    await asyncio.sleep(3)
    await variables["down"].set_value(False)
    print("Drill Step 15: down = False")
    await asyncio.sleep(3)

    # Step 13
    await variables["in"].set_value(True)
    print("Drill Step 16: in = True")
    await asyncio.sleep(3)
    await variables["in"].set_value(False)







    await variables["drop_aktiv"].set_value(False)
    await variables["drop_finished"].set_value(True)



async def pick(variables):
    print("\U0001F4E6 Starting pick process...")

    print("Pick activated")
    await variables["out"].set_value(True)
    print("Drill Step 1: out = True")
    await asyncio.sleep(3)
    await variables["out"].set_value(False)

    # Step 2
    await variables["down"].set_value(True)
    print("Drill Step 2: down = True")
    await asyncio.sleep(3)
    await variables["down"].set_value(False)
    print("Drill Step 3: down = False")
    await asyncio.sleep(3)

    # Step 3
    await variables["in"].set_value(True)
    print("Drill Step 4: in = True")
    await asyncio.sleep(3)
    await variables["in"].set_value(False)

    # Step 4
    await variables["down"].set_value(True)
    print("Drill Step 5: down = True")
    await asyncio.sleep(3)
    await variables["down"].set_value(False)
    print("Drill Step 6: down = False")
    await asyncio.sleep(3)

    # Step 5
    await variables["drill_conveyor"].set_value(True)
    print("Drill Step 7: drill_conveyor = True")
    await asyncio.sleep(5)
    await variables["drill_conveyor"].set_value(False)

    await variables["pick_finished"].set_value(True)
    print("Pick finished")

    await asyncio.sleep(1)

    print("\u2705 Pick process completed.")

async def drill(variables,duration):
    await variables["drill"].set_value(True)
    await asyncio.sleep(duration)
    await variables["drill"].set_value(False)


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
    server.set_security_policy([ua.SecurityPolicyType.NoSecurity])

    uri = os.getenv("NAMESPACE_URI")
    await server.register_namespace(uri)
    idx = 4  # Force namespace index

    objects = server.nodes.objects
    drill_station = await objects.add_object(ua.NodeId("DrillStation", idx), "DrillStation")

    def get_node_id(env_var):
        return ua.NodeId(int(os.getenv(env_var)), idx)

    variables = {
        "out": await drill_station.add_variable(get_node_id("NODEID_RAUS"), "out", False, ua.VariantType.Boolean),
        "in": await drill_station.add_variable(get_node_id("NODEID_REIN"), "in", False, ua.VariantType.Boolean),
        "down": await drill_station.add_variable(get_node_id("NODEID_RUNTER"), "down", False, ua.VariantType.Boolean),
        "drill": await drill_station.add_variable(get_node_id("NODEID_BOHRER"), "drill", False, ua.VariantType.Boolean),
        "drill_conveyor": await drill_station.add_variable(get_node_id("NODEID_BAND_BOHRER"), "drill_conveyor", False, ua.VariantType.Boolean),
        "fts_conveyor": await drill_station.add_variable(get_node_id("NODEID_BAND_FTS"), "fts_conveyor", False, ua.VariantType.Boolean),
        "cmd__start": await drill_station.add_variable(get_node_id("NODEID_CMD_START"), "cmd__start", False, ua.VariantType.Boolean),
        "Operations_Finish": await drill_station.add_variable(get_node_id("NODEID_PROCESS_DRILL_FINISH"), "Operations_Finish", False, ua.VariantType.Boolean),

        "drill_aktiv": await drill_station.add_variable(get_node_id("NODEID_DRILL_AKTIV"), "drill_aktiv", False, ua.VariantType.Boolean),
        "drill_finished": await drill_station.add_variable(get_node_id("NODEID_DRILL_FINISHED"), "drill_finished", False, ua.VariantType.Boolean),
        "drop_aktiv": await drill_station.add_variable(get_node_id("NODEID_DROP_AKTIV"), "drop_aktiv", False, ua.VariantType.Boolean),
        "drop_finished": await drill_station.add_variable(get_node_id("NODEID_DROP_FINISHED"), "drop_finished", False, ua.VariantType.Boolean),
        "pick_aktiv": await drill_station.add_variable(get_node_id("NODEID_PICK_AKTIV"), "pick_aktiv", False, ua.VariantType.Boolean),
        "pick_finished": await drill_station.add_variable(get_node_id("NODEID_PICK_FINISHED"), "pick_finished", False, ua.VariantType.Boolean),
        "drill_duration": await drill_station.add_variable(get_node_id("NODEID_DRILL_DURATION"), "drill_duration", 0, ua.VariantType.Int16)
    
    }

    serial_number_nodeid = ua.NodeId("SerialNumber", 3)
    serial_number = await drill_station.add_variable(serial_number_nodeid, "SerialNumber", "DRILL001", ua.VariantType.String)
    model_nodeid = ua.NodeId(int(os.getenv("NODEID_MODEL")), idx)
    version_nodeid = ua.NodeId(int(os.getenv("NODEID_VERSION")), idx)
    model = await drill_station.add_variable(model_nodeid, "model", "DRILL", ua.VariantType.String)
    version = await drill_station.add_variable(version_nodeid, "version", "v1.0", ua.VariantType.String)

    await serial_number.set_writable()
    await model.set_writable()
    await version.set_writable()

    variables["SerialNumber"] = serial_number
    variables["model"] = model
    variables["version"] = version

    for name, var in variables.items():
        await var.set_writable()
        logger.info(f"Created variable {name} with NodeId: {var.nodeid}")

    print(f"\u2705 OPC UA Server started at {os.getenv('OPCUA_ENDPOINT')}")


    async with server:
        try:
            while True:
                if await variables["cmd__start"].get_value():
                    await run_drilling_process(variables)
                    await variables["cmd__start"].set_value(False)
                    await variables["Operations_Finish"].set_value(True)
                    await asyncio.sleep(2)

                if await variables["pick_aktiv"].get_value():
                    await pick(variables)
                    await variables["pick_aktiv"].set_value(False)
                    await variables["pick_finished"].set_value(True)
                
                if await variables["drop_aktiv"].get_value() :
                    await drop(variables)
                    await variables["drop_aktiv"].set_value(False)
                    await variables["drop_finished"].set_value(True)
                    await reset_nodes_to_default(variables)


                drill_aktiv_value = await variables["drill_aktiv"].get_value()
                drill_duration_value = await variables["drill_duration"].get_value()

                if drill_aktiv_value and drill_duration_value > 0:
                    print("Starting drill process")
                    print(drill_duration_value)
                    await drill(variables,drill_duration_value)
                    await variables["drill_aktiv"].set_value(False)
                    await variables["drill_finished"].set_value(True)
                await asyncio.sleep(1)

        except asyncio.CancelledError:
            logger.info("\U0001F6D1 Server stopped")
        except Exception as e:
            logger.error(f"\u274C Server error: {e}")


if __name__ == "__main__":
    asyncio.run(main())
