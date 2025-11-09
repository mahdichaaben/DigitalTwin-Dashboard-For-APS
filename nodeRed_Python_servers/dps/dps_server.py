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
    dps_station = await objects.add_object(ua.NodeId("dpsStation", idx), "dpsStation")

    def get_node_id(env_var):
        return ua.NodeId(int(os.getenv(env_var)), idx)

    variables = {
    }

    serial_number_nodeid = ua.NodeId("SerialNumber", 3)  # ns=3;s=SerialNumber
    serial_number = await dps_station.add_variable(serial_number_nodeid, "SerialNumber", "DPS001", ua.VariantType.String)
    model_nodeid = ua.NodeId(int(os.getenv("NODEID_MODEL")), idx)
    version_nodeid = ua.NodeId(int(os.getenv("NODEID_VERSION")), idx)
    model = await dps_station.add_variable(model_nodeid, "model", "DPS", ua.VariantType.String)
    version = await dps_station.add_variable(version_nodeid, "version", "v1.0", ua.VariantType.String)

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
                await asyncio.sleep(1)
        except asyncio.CancelledError:
            logger.info("\U0001F6D1 Server stopped")
        except Exception as e:
            logger.error(f"\u274C Server error: {e}")

if __name__ == "__main__":
    asyncio.run(main())