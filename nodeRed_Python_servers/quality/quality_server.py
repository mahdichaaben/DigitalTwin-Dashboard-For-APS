import asyncio
import logging
import os
from dotenv import load_dotenv
from asyncua import Server, ua

load_dotenv()
OPCUA_ENDPOINT    = os.getenv("OPCUA_ENDPOINT")
SERVER_NAME       = os.getenv("SERVER_NAME")
NAMESPACE_URI     = os.getenv("NAMESPACE_URI")

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def run_ai_quality_process(vars):
    print("🔍 Starting AI quality process…")

    # 1. Extend sensor arm
    await vars["extend_arm"].set_value(True)
    print("extend_arm: True")
    await asyncio.sleep(3)
    await vars["extend_arm"].set_value(False)
    await asyncio.sleep(1)


    # 2. Lower inspection head
    await vars["lower_head"].set_value(True)
    print("lower_head: True")
    await asyncio.sleep(3)
    await vars["lower_head"].set_value(False)
    await asyncio.sleep(3)



    # 3. Retract sensor arm
    await vars["retract_arm"].set_value(True)
    print("retract_arm: True")
    await asyncio.sleep(2)
    await vars["retract_arm"].set_value(False)



    await vars["lower_head"].set_value(True)
    print("lower_head: True")
    await asyncio.sleep(3)
    await vars["lower_head"].set_value(False)
    await asyncio.sleep(3)


    # 4. Start AI conveyor
    await vars["ai_conveyor"].set_value(True)
    print("ai_conveyor: True")
    await asyncio.sleep(3)
    await vars["ai_conveyor"].set_value(False)




    await asyncio.sleep(2)





    # 5. Start FTS conveyor
    await vars["fts_conveyor"].set_value(True)
    print("fts_conveyor: True")
    await asyncio.sleep(3)
    await vars["fts_conveyor"].set_value(False)
    await asyncio.sleep(2)



    await vars["lower_head"].set_value(True)
    print("lower_head: True")
    await asyncio.sleep(3)
    await vars["lower_head"].set_value(False)
    await asyncio.sleep(3)


    await vars["extend_arm"].set_value(True)
    print("extend_arm: True")
    await asyncio.sleep(3)
    await vars["extend_arm"].set_value(False)
    await asyncio.sleep(1)


    await vars["lower_head"].set_value(True)
    print("lower_head: True")
    await asyncio.sleep(3)
    await vars["lower_head"].set_value(False)
    await asyncio.sleep(3)



    await vars["retract_arm"].set_value(True)
    print("retract_arm: True")
    await asyncio.sleep(3)
    await vars["retract_arm"].set_value(False)


    # 6. Mark process as finished
    await vars["ai_finish"].set_value(True)
    print("ai_finish: True")

    await asyncio.sleep(3)


    await vars["ai_finish"].set_value(False)
    print("ai_finish: False")

    # 7. Reset start command
    await vars["start_command"].set_value(False)

    # 8. Clean up
    await asyncio.sleep(1)
    for key, v in vars.items():
        if key not in ("start_command", "ai_finish"):
            await v.set_value(False)

    print("✅ AI quality process finished.")

async def drop(vars):
    
    # 5. Start FTS conveyor
    await vars["fts_conveyor"].set_value(True)
    print("fts_conveyor: True")
    await asyncio.sleep(3)
    await vars["fts_conveyor"].set_value(False)
    await asyncio.sleep(2)



    await vars["lower_head"].set_value(True)
    print("lower_head: True")
    await asyncio.sleep(3)
    await vars["lower_head"].set_value(False)
    await asyncio.sleep(3)


    await vars["extend_arm"].set_value(True)
    print("extend_arm: True")
    await asyncio.sleep(3)
    await vars["extend_arm"].set_value(False)
    await asyncio.sleep(1)


    await vars["lower_head"].set_value(True)
    print("lower_head: True")
    await asyncio.sleep(3)
    await vars["lower_head"].set_value(False)
    await asyncio.sleep(3)



    await vars["retract_arm"].set_value(True)
    print("retract_arm: True")
    await asyncio.sleep(3)
    await vars["retract_arm"].set_value(False)


    # 6. Mark process as finished
    await vars["ai_finish"].set_value(True)
    print("ai_finish: True")

    await asyncio.sleep(3)


    await vars["ai_finish"].set_value(False)
    print("ai_finish: False")

    # 7. Reset start command
    await vars["start_command"].set_value(False)


async def pick(vars):
        # 1. Extend sensor arm
    await vars["extend_arm"].set_value(True)
    print("extend_arm: True")
    await asyncio.sleep(3)
    await vars["extend_arm"].set_value(False)
    await asyncio.sleep(1)


    # 2. Lower inspection head
    await vars["lower_head"].set_value(True)
    print("lower_head: True")
    await asyncio.sleep(3)
    await vars["lower_head"].set_value(False)
    await asyncio.sleep(3)



    # 3. Retract sensor arm
    await vars["retract_arm"].set_value(True)
    print("retract_arm: True")
    await asyncio.sleep(2)
    await vars["retract_arm"].set_value(False)



    await vars["lower_head"].set_value(True)
    print("lower_head: True")
    await asyncio.sleep(3)
    await vars["lower_head"].set_value(False)
    await asyncio.sleep(3)


    await vars["ai_conveyor"].set_value(True)
    print("ai_conveyor: True")
    await asyncio.sleep(3)
    await vars["ai_conveyor"].set_value(False)


async def ck(vars):
    await asyncio.sleep(5)


async def reset_nodes_to_default(node_dict: dict):
    await asyncio.sleep(3)
    for name, node in node_dict.items():
        try:
            val = await node.read_value()
            if isinstance(val, bool):
                await node.write_value(False)
        except Exception as e:
            print(f"⚠️ Failed to reset '{name}': {e}")





# ─── Main Server Loop ───────────────────────────────────────────────────────
async def main():
    server = Server()
    await server.init()

    server.set_endpoint(OPCUA_ENDPOINT)
    server.set_server_name(SERVER_NAME)

    idx = await server.register_namespace(NAMESPACE_URI)

    idx = 4
    logger.info(f"✅ Registered namespace '{NAMESPACE_URI}' as ns={idx}")

    # Create main object
    objects = server.nodes.objects
    station = await objects.add_object(ua.NodeId("AIQualityStation", idx), "AIQualityStation")

    def get_node(env_key): return ua.NodeId(int(os.getenv(env_key)), idx)

    # Define OPC UA vars with readable names
    vars = {
        "extend_arm":     await station.add_variable(get_node("NODEID_RAUS"),         "extend_arm",     False, ua.VariantType.Boolean),
        "retract_arm":    await station.add_variable(get_node("NODEID_REIN"),         "retract_arm",    False, ua.VariantType.Boolean),
        "lower_head":     await station.add_variable(get_node("NODEID_RUNTER"),       "lower_head",     False, ua.VariantType.Boolean),
        "ai_conveyor":    await station.add_variable(get_node("NODEID_BAND_AI"),      "ai_conveyor",    False, ua.VariantType.Boolean),
        "fts_conveyor":   await station.add_variable(get_node("NODEID_BAND_FTS"),     "fts_conveyor",   False, ua.VariantType.Boolean),
        "start_command":  await station.add_variable(get_node("NODEID_CMD_START_AI"), "start_command",  False, ua.VariantType.Boolean),
        "ai_finish":      await station.add_variable(get_node("NODEID_AI_FINISH"),    "ai_finish",      False, ua.VariantType.Boolean),
        

        
        
        "drop_aktiv": await station.add_variable(get_node("NODEID_DROP_AKTIV"), "drop_aktiv", False, ua.VariantType.Boolean),
        "drop_finished": await station.add_variable(get_node("NODEID_DROP_FINISHED"), "drop_finished", False, ua.VariantType.Boolean),
        "pick_aktiv": await station.add_variable(get_node("NODEID_PICK_AKTIV"), "pick_aktiv", False, ua.VariantType.Boolean),
        "pick_finished": await station.add_variable(get_node("NODEID_PICK_FINISHED"), "pick_finished", False, ua.VariantType.Boolean),

        "check_quality_aktiv": await station.add_variable(get_node("CHECK_QUALITY_AKTIV"), "check_quality_aktiv", False, ua.VariantType.Boolean),
        "check_quality_waitResult": await station.add_variable(get_node("CHECK_QUALITY_WR"), "check_quality_waitResult", False, ua.VariantType.Boolean),

        "quality_rgood": await station.add_variable(get_node("QUALITY_RGOOD"), "quality_rgood", False, ua.VariantType.Boolean),
        "quality_rbad": await station.add_variable(get_node("QUALITY_RBAD"), "quality_rbad", False, ua.VariantType.Boolean),

        "quality_rgood_finished": await station.add_variable(get_node("QUALITY_RGOOD_FINISHED"), "quality_rgood_finished", False, ua.VariantType.Boolean),
        "quality_rbad_finished": await station.add_variable(get_node("QUALITY_RBAD_FINISHED"), "quality_rbad_finished", False, ua.VariantType.Boolean),

    
    }


    serial_number_nodeid = ua.NodeId("SerialNumber", 3)
    serial_number = await station.add_variable(serial_number_nodeid, "SerialNumber", "AIQS001", ua.VariantType.String)
    model_nodeid = ua.NodeId(int(os.getenv("NODEID_MODEL")), idx)
    version_nodeid = ua.NodeId(int(os.getenv("NODEID_VERSION")), idx)
    model = await station.add_variable(model_nodeid, "model", "AIQS", ua.VariantType.String)
    version = await station.add_variable(version_nodeid, "version", "v1.0", ua.VariantType.String)

    await serial_number.set_writable()
    await model.set_writable()
    await version.set_writable()

    vars["SerialNumber"] = serial_number
    vars["model"] = model
    vars["version"] = version


    # Make all vars writable
    for name, var in vars.items():
        await var.set_writable()
        logger.info(f"📌 Variable '{name}' created at NodeId={var.nodeid}")

    print(f"✅ AI Quality OPC UA Server is listening at {OPCUA_ENDPOINT}")




    # Server loop: Listen for start command
    async with server:
        try:
            while True:
                if await vars["start_command"].get_value():
                    await run_ai_quality_process(vars)

                if await vars["pick_aktiv"].get_value():
                    await pick(vars)
                    await vars["pick_aktiv"].set_value(False)
                    await vars["pick_finished"].set_value(True)
                
                if await vars["drop_aktiv"].get_value() :
                    await drop(vars)
                    await vars["drop_aktiv"].set_value(False)
                    await vars["drop_finished"].set_value(True)
                    await reset_nodes_to_default(vars)

                if await vars["check_quality_aktiv"].get_value():
                    await ck(vars)
                    await vars["check_quality_aktiv"].set_value(False)
                    await vars["check_quality_waitResult"].set_value(True)

                if await vars["quality_rgood"].get_value():
                    await asyncio.sleep(3)
                    await vars["quality_rgood"].set_value(False)
                    await vars["quality_rgood_finished"].set_value(True)

                if await vars["quality_rbad"].get_value():
                    await asyncio.sleep(3)
                    await vars["quality_rbad"].set_value(False)
                    await vars["quality_rbad_finished"].set_value(True)

                await asyncio.sleep(1)
        except asyncio.CancelledError:
            logger.info("🛑 Server stopped")
        except Exception as e:
            logger.error(f"❌ Server error: {e}")

if __name__ == "__main__":
    asyncio.run(main())
