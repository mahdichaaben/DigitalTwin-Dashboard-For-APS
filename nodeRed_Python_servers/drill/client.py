import asyncio
from asyncua import Client, ua
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def test_opcua_client():
    # Define the server endpoint
    endpoint = "opc.tcp://127.0.0.1:4840"
    
    # Create client with no security
    client = Client(url=endpoint)
    try:
        # Connect to the server
        async with client:
            logger.info(f"Connected to {endpoint}")

            # Define NodeIds for cmd__start_drill and Drill_Finish
            start_node = client.get_node("ns=4;i=99")
            finish_node = client.get_node("ns=4;i=7")

            # Read initial value of cmd__start_drill
            start_value = await start_node.read_value()
            logger.info(f"Initial cmd__start_drill value: {start_value}")

            # Write True to cmd__start_drill to trigger the process
            logger.info("Writing True to cmd__start_drill")
            await start_node.write_value(True, ua.VariantType.Boolean)

            # Wait for the drilling process to complete (adjust based on your process duration)
            await asyncio.sleep(20)  # Your drilling process takes ~50 seconds based on sleep durations

            # Read Drill_Finish to confirm completion
            finish_value = await finish_node.read_value()
            logger.info(f"Drill_Finish value: {finish_value}")

            # Read cmd__start_drill again to confirm it was reset
            start_value = await start_node.read_value()
            logger.info(f"Final cmd__start_drill value: {start_value}")

    except Exception as e:
        logger.error(f"Error: {e}")

if __name__ == "__main__":
    asyncio.run(test_opcua_client())