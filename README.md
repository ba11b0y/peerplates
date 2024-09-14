# Peerplates



## Backend
## Running the project

To run the project, you need to have Python 3.10 or higher installed.

Then create and activate the virtual environment and install the dependencies:

```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

Create a `.env` file with the following environment variables:

```bash
MONGODB_PASSWORD=<your-mongodb-password>
AZURE_OPENAI_API_KEY=<your-azure-api>
AZURE_ENDPOINT=<your-azure-endpoint>
```

Then source the `.env` file:

```bash
source .env
```

Then run the project:

```bash
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

It currently contains the following endpoints:  

- GET /dishes - Get a list of dishes
- POST /dishes - Create a new dish
- PUT /dishes/{dish_id} - Update a dish by ID