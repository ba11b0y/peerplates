# Database integration
from dotenv import load_dotenv
import os
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from urllib.parse import quote_plus

load_dotenv(dotenv_path='.env')
# Get the database password from an environment variable
db_password = os.environ.get('MONGODB_PASSWORD')

# Escape the username and password
escaped_username = quote_plus("peerplates")
escaped_password = quote_plus(db_password)

# Construct the connection string with escaped credentials
connection_string = f"mongodb+srv://{escaped_username}:{escaped_password}@peerplates.ovn9z.mongodb.net/?retryWrites=true&w=majority&appName=peerplates"

# Connect to MongoDB
client = MongoClient(connection_string, server_api=ServerApi('1'))

# Send a ping to confirm a successful connection
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)
