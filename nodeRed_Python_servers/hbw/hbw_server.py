import asyncio
import logging
import os
from dotenv import load_dotenv
from asyncua import Server, ua

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def run_hbw_process(variables):
    logger.info("🔧 Running HBW process...")
    


    await variables["VACCUM_DOWN"].set_value(True)
    print("MoveDown: True")
    await asyncio.sleep(1)
    await variables["VACCUM_DOWN"].set_value(True)
    print("MoveDown: True")
    await asyncio.sleep(5)

    await variables["VACCUM_DOWN"].set_value(False)
    print("MoveDown: False")

    await asyncio.sleep(2)

    await variables["VACCUM_UP"].set_value(True)
    print("VACCUM_UP: TRUE")
    await asyncio.sleep(3)

    await variables["VACCUM_UP"].set_value(False)
    print("VACCUM_UP: False")

    await asyncio.sleep(1)
    await variables["RotateCCW"].set_value(True)
    print("RotateCCW: TRUE")
    await asyncio.sleep(3)
    await variables["RotateCCW"].set_value(False)
    await asyncio.sleep(1)




    await variables["GO_CASE"].set_value(True)
    print("GO_CASE: True")
    await asyncio.sleep(6)
    await variables["GO_CASE"].set_value(False)
   



    await variables["RBG_OUT"].set_value(True)
    await asyncio.sleep(4)
    await variables["RBG_OUT"].set_value(False)


    await variables["RBG_IN"].set_value(True)
    await asyncio.sleep(4)
    await variables["RBG_IN"].set_value(False)


    await asyncio.sleep(2)

    await variables["RETURN_CASE"].set_value(True)

    await asyncio.sleep(3)

    await variables["RETURN_CASE"].set_value(False)
    print("RETURN_CASE: True")


    await variables["RBG_OUT"].set_value(True)
    await asyncio.sleep(3)
    await variables["RBG_OUT"].set_value(False)






    await variables["VACCUM_DOWN"].set_value(True)
    print("MoveDown: True")

    await asyncio.sleep(4)

    await variables["VACCUM_DOWN"].set_value(False)
    print("MoveDown: False")
    await asyncio.sleep(2)
    await variables["VACCUM_UP"].set_value(True)
    print("VACCUM_UP: TRUE")

    await asyncio.sleep(4)

    await variables["VACCUM_UP"].set_value(False)
    print("VACCUM_UP: False")

    await asyncio.sleep(2)


    await variables["RBG_IN"].set_value(True)
    await asyncio.sleep(4)
    await variables["RBG_IN"].set_value(False)




    
    await variables["RotateCW"].set_value(True)
    print("RotateCCW: TRUE")
    await asyncio.sleep(3)
    await variables["RotateCW"].set_value(False)








    await variables["GO_CASE"].set_value(True)
    print("GO_CASE: True")
    await asyncio.sleep(4)
    await variables["GO_CASE"].set_value(False)
   



    await variables["RBG_OUT"].set_value(True)
    await asyncio.sleep(4)
    await variables["RBG_OUT"].set_value(False)


    await variables["RBG_IN"].set_value(True)
    await asyncio.sleep(4)
    await variables["RBG_IN"].set_value(False)


    await asyncio.sleep(1)

    await variables["RETURN_CASE"].set_value(True)

    await asyncio.sleep(3)

    await variables["RETURN_CASE"].set_value(False)
    print("RETURN_CASE: True")
    



    await variables["VACCUM_DOWN"].set_value(True)
    print("MoveDown: True")

    await asyncio.sleep(5)

    await variables["VACCUM_DOWN"].set_value(False)
    print("MoveDown: False")

    await variables["VACCUM_UP"].set_value(True)
    print("VACCUM_UP: TRUE")

    await asyncio.sleep(5)

    await variables["VACCUM_UP"].set_value(False)
    print("VACCUM_UP: False")








    logger.info("✅ HBW process completed.")

async def pick_piece_from_agv(variables):


    await variables["VACCUM_DOWN"].set_value(True)
    print("MoveDown: True")
    await asyncio.sleep(1)
    await variables["VACCUM_DOWN"].set_value(True)
    print("MoveDown: True")
    await asyncio.sleep(5)


    await variables["VACCUM_DOWN"].set_value(False)
    print("MoveDown: False")

    await asyncio.sleep(2)

    await variables["VACCUM_UP"].set_value(True)
    print("VACCUM_UP: TRUE")
    await asyncio.sleep(3)

    await variables["VACCUM_UP"].set_value(False)
    print("VACCUM_UP: False")

    await asyncio.sleep(1)
    await variables["RotateCCW"].set_value(True)
    print("RotateCCW: TRUE")
    await asyncio.sleep(3)
    await variables["RotateCCW"].set_value(False)
    await asyncio.sleep(1)

async def place_piece_in_hbw(variables):

    await variables["GO_CASE"].set_value(True)
    print("GO_CASE: True")
    await asyncio.sleep(6)
    await variables["GO_CASE"].set_value(False)
   



    await variables["RBG_OUT"].set_value(True)
    await asyncio.sleep(4)
    await variables["RBG_OUT"].set_value(False)


    await variables["RBG_IN"].set_value(True)
    await asyncio.sleep(4)
    await variables["RBG_IN"].set_value(False)


    await asyncio.sleep(2)

    await variables["RETURN_CASE"].set_value(True)

    await asyncio.sleep(3)

    await variables["RETURN_CASE"].set_value(False)
    print("RETURN_CASE: True")


    await variables["RBG_OUT"].set_value(True)
    await asyncio.sleep(3)
    await variables["RBG_OUT"].set_value(False)



    await variables["VACCUM_DOWN"].set_value(True)
    print("MoveDown: True")

    await asyncio.sleep(4)

    await variables["VACCUM_DOWN"].set_value(False)
    print("MoveDown: False")
    await asyncio.sleep(2)
    await variables["VACCUM_UP"].set_value(True)
    print("VACCUM_UP: TRUE")

    await asyncio.sleep(4)

    await variables["VACCUM_UP"].set_value(False)
    print("VACCUM_UP: False")

    await asyncio.sleep(2)


    await variables["RBG_IN"].set_value(True)
    await asyncio.sleep(4)
    await variables["RBG_IN"].set_value(False)




    
    await variables["RotateCW"].set_value(True)
    print("RotateCCW: TRUE")
    await asyncio.sleep(3)
    await variables["RotateCW"].set_value(False)








    await variables["GO_CASE"].set_value(True)
    print("GO_CASE: True")
    await asyncio.sleep(4)
    await variables["GO_CASE"].set_value(False)
   



    await variables["RBG_OUT"].set_value(True)
    await asyncio.sleep(4)
    await variables["RBG_OUT"].set_value(False)


    await variables["RBG_IN"].set_value(True)
    await asyncio.sleep(4)
    await variables["RBG_IN"].set_value(False)


    await asyncio.sleep(1)

    await variables["RETURN_CASE"].set_value(True)

    await asyncio.sleep(3)

    await variables["RETURN_CASE"].set_value(False)
    print("RETURN_CASE: True")
    



    await variables["VACCUM_DOWN"].set_value(True)
    print("MoveDown: True")

    await asyncio.sleep(5)

    await variables["VACCUM_DOWN"].set_value(False)
    print("MoveDown: False")

    await variables["VACCUM_UP"].set_value(True)
    print("VACCUM_UP: TRUE")

    await asyncio.sleep(5)

    await variables["VACCUM_UP"].set_value(False)
    print("VACCUM_UP: False")








    logger.info("✅ HBW process completed.")



async def pick_piece_from_hbw(variables):

    await variables["GO_CASE"].set_value(True)
    print("GO_CASE: True")
    await asyncio.sleep(4)
    await variables["GO_CASE"].set_value(False)
   
    await variables["RBG_OUT"].set_value(True)
    await asyncio.sleep(4)
    await variables["RBG_OUT"].set_value(False)

    await variables["RBG_IN"].set_value(True)
    await asyncio.sleep(4)
    await variables["RBG_IN"].set_value(False)


    await asyncio.sleep(1)

    await variables["RETURN_CASE"].set_value(True)

    await asyncio.sleep(3)

    await variables["RETURN_CASE"].set_value(False)
    print("RETURN_CASE: True")


    await variables["RBG_OUT"].set_value(True)
    await asyncio.sleep(4)
    await variables["RBG_OUT"].set_value(False)

    

    

async def drop_piece_in_agv(variables):

    await variables["RotateCCW"].set_value(True)
    print("RotateCCW: TRUE")
    await asyncio.sleep(3)
    await variables["RotateCCW"].set_value(False)
    await asyncio.sleep(1)

    await variables["VACCUM_DOWN"].set_value(True)
    print("MoveDown: True")

    await asyncio.sleep(4)

    await variables["VACCUM_DOWN"].set_value(False)
    print("MoveDown: False")
    await asyncio.sleep(2)
    await variables["VACCUM_UP"].set_value(True)
    print("VACCUM_UP: TRUE")

    await asyncio.sleep(4)

    await variables["VACCUM_UP"].set_value(False)
    print("VACCUM_UP: False")



    
    await variables["RBG_IN"].set_value(True)
    await asyncio.sleep(4)
    await variables["RBG_IN"].set_value(False)


        
    await variables["RotateCW"].set_value(True)
    print("RotateCCW: TRUE")
    await asyncio.sleep(3)
    await variables["RotateCW"].set_value(False)


    
    await variables["VACCUM_DOWN"].set_value(True)
    print("MoveDown: True")
    await asyncio.sleep(1)
    await variables["VACCUM_DOWN"].set_value(True)
    print("MoveDown: True")
    await asyncio.sleep(5)

    await variables["VACCUM_DOWN"].set_value(False)
    print("MoveDown: False")

    await asyncio.sleep(2)

    await variables["VACCUM_UP"].set_value(True)
    print("VACCUM_UP: TRUE")
    await asyncio.sleep(3)

    await variables["VACCUM_UP"].set_value(False)
    print("VACCUM_UP: False")

    await asyncio.sleep(1)

    

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

    uri = os.getenv("NAMESPACE_URI")
    idx = await server.register_namespace(uri)
    idx = 4
    logger.info(f"✅ Registered namespace URI '{uri}' with index {idx}")

    print(f"🔍 Existing nodes under Objects for ns={idx}:")
    for child in await server.nodes.objects.get_children():
        nid = child.nodeid
        if nid.NamespaceIndex == idx:
            bn = await child.read_browse_name()
            print(f"    • NodeId={nid.Identifier}, BrowseName={bn.Name}")

    objects = server.nodes.objects
    hbw_station = await objects.add_object(ua.NodeId("HbwStation", idx), "HbwStation")

    def get_node_id(env_var):
        return ua.NodeId(int(os.getenv(env_var)), idx)

    variables = {
        "RefRotation": await hbw_station.add_variable(get_node_id("NODEID_REF_DREHUNG"), "RefRotation", False),
        "VACCUM_UP": await hbw_station.add_variable(get_node_id("NODEID_VACCUM_UP"), "LifterUp", False),
        "VACCUM_DOWN": await hbw_station.add_variable(get_node_id("NODEID_VACCUM_DOWN"), "LifterDown", False),
        "SensorMiddle": await hbw_station.add_variable(get_node_id("NODEID_SCHALTER_SAUGER_MITTE"), "SensorMiddle", False),
        "SensorUp": await hbw_station.add_variable(get_node_id("NODEID_SCHALTER_SAUGER_OBEN"), "SensorUp", False),
        "SensorDown": await hbw_station.add_variable(get_node_id("NODEID_SCHALTER_SAUGER_UNTEN"), "SensorDown", False),
        "VacuumValve": await hbw_station.add_variable(get_node_id("NODEID_VENTIL_VAKUUM"), "VacuumValve", False),
        "RBG_OUT": await hbw_station.add_variable(get_node_id("NODEID_RBG_OUT"), "RBG_OUT", False),
        "RBG_IN": await hbw_station.add_variable(get_node_id("NODEID_RBG_IN"), "RBG_IN", False),
        "RefX": await hbw_station.add_variable(get_node_id("NODEID_REF_HRL_X_HORIZONTAL"), "RefX", False),
        "RefY": await hbw_station.add_variable(get_node_id("NODEID_REF_HRL_Y"), "RefY", False),
        "SensorBack": await hbw_station.add_variable(get_node_id("NODEID_SCHALTER_RBG_HINTEN"), "SensorBack", False),
        "SensorFront": await hbw_station.add_variable(get_node_id("NODEID_SCHALTER_RBG_VORN"), "SensorFront", False),
        "RETURN_CASE": await hbw_station.add_variable(get_node_id("RETURN_CASE"), "RETURN_CASE", False),
        "GO_CASE": await hbw_station.add_variable(get_node_id("NODEID_GO_CASE"), "NODEID_GO_CASE", False),
        "YAxisUp": await hbw_station.add_variable(get_node_id("NODEID_YACHSE_HOCH"), "YAxisUp", False),
        "YAxisDown": await hbw_station.add_variable(get_node_id("NODEID_YACHSE_RUNTER"), "YAxisDown", False),
        "RotateCW": await hbw_station.add_variable(get_node_id("NODEID_CL"), "Rotate_CW", False),
        "RotateCCW": await hbw_station.add_variable(get_node_id("NODEID_CCL"), "Rotate_CCW", False),
        "StartProcess": await hbw_station.add_variable(get_node_id("NODEID_START"), "START", False),
        "ProcessFinished": await hbw_station.add_variable(get_node_id("NODEID_FINISH"), "FINISH", True),


        "pick_process_aktiv": await hbw_station.add_variable(get_node_id("NODEID_PICK_PROCESS_AKTIV"), "pick_process_aktiv", False, ua.VariantType.Boolean),
        "pick_process_finished": await hbw_station.add_variable(get_node_id("NODEID_PICK_PROCESS_FINISHED"), "pick_process_finished", False, ua.VariantType.Boolean),
        
        "drop_process_aktiv": await hbw_station.add_variable(get_node_id("NODEID_DROP_PROCESS_AKTIV"), "place_piece_in_hbw_aktiv", False, ua.VariantType.Boolean),
        "drop_process_finished": await hbw_station.add_variable(get_node_id("NODEID_DROP_PROCESS_FINISHED"), "place_piece_in_hbw_finished", False, ua.VariantType.Boolean)
    
    }


    serial_number_nodeid = ua.NodeId("SerialNumber", 3)
    serial_number = await hbw_station.add_variable(serial_number_nodeid, "SerialNumber", "HBW001", ua.VariantType.String)
    model_nodeid = ua.NodeId(int(os.getenv("NODEID_MODEL")), idx)
    version_nodeid = ua.NodeId(int(os.getenv("NODEID_VERSION")), idx)
    model = await hbw_station.add_variable(model_nodeid, "model", "HBW", ua.VariantType.String)
    version = await hbw_station.add_variable(version_nodeid, "version", "v1.0", ua.VariantType.String)

    case_drop_nodeid=ua.NodeId(int(os.getenv("NODEID_CASE_PICK")), idx)
    case_pick_nodeid=ua.NodeId(int(os.getenv("NODEID_CASE_DROP")), idx)

    case_drop = await hbw_station.add_variable(case_drop_nodeid, "case_drop", "A1", ua.VariantType.String)
    case_pick = await hbw_station.add_variable(case_pick_nodeid, "case_pick", "A1", ua.VariantType.String)


    await serial_number.set_writable()
    await model.set_writable()
    await version.set_writable()

    variables["SerialNumber"] = serial_number
    variables["model"] = model
    variables["version"] = version

    variables["case_drop"]=case_drop
    variables["case_pick"]=case_pick
    

    for name, var in variables.items():
        await var.set_writable()
        logger.info(f"✅ Created variable '{name}' with NodeId: {var.nodeid}")

    print(f"✅ OPC UA Server started at {os.getenv('OPCUA_ENDPOINT')}")

    async with server:
        try:
            while True:
                if await variables["StartProcess"].get_value():
                    await run_hbw_process(variables)
                    await variables["StartProcess"].set_value(False)
                    await variables["ProcessFinished"].set_value(True)
                    await asyncio.sleep(2)
                    await variables["ProcessFinished"].set_value(False)

                if await variables["pick_process_aktiv"].get_value():
                    await pick_piece_from_agv(variables)
                    await place_piece_in_hbw(variables)
                    await variables["pick_process_aktiv"].set_value(False)
                    await variables["pick_process_finished"].set_value(True)
                    await reset_nodes_to_default(variables)


                if await variables["drop_process_aktiv"].get_value():
                    await pick_piece_from_hbw(variables)
                    await drop_piece_in_agv(variables)
                    await variables["drop_process_aktiv"].set_value(False)
                    await variables["drop_process_finished"].set_value(True)
                    await reset_nodes_to_default(variables)

                await asyncio.sleep(1)
        except asyncio.CancelledError:
            logger.info("🛑 Server stopped")
        except Exception as e:
            logger.error(f"❌ Server error: {e}")

if __name__ == "__main__":
    asyncio.run(main())
