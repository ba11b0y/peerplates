import itertools
from fastapi import FastAPI, HTTPException, UploadFile, File, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional
from fastapi import FastAPI, HTTPException, UploadFile, File
from pydantic import BaseModel, Field, BeforeValidator, ConfigDict, NonNegativeFloat
from typing import List, Optional, Annotated
from uuid import UUID
from db import client
from bson import ObjectId
import uuid
import uvicorn
from bson.binary import UUID as BsonUUID
from typing import Optional, Annotated
from enum import Enum
from azure_api import generate_response, get_all_dishes
from azure.storage.blob import BlobServiceClient
from azure_vision import analyze_image_with_prompt
import os
from dotenv import load_dotenv
from chat import chat_endpoint

load_dotenv()  # Load environment variables from .env file

# Azure Blob Storage configuration
connect_str = os.getenv('AZURE_STORAGE_CONNECTION_STRING')
container_name = os.getenv('AZURE_STORAGE_CONTAINER_NAME')
blob_service_client = BlobServiceClient.from_connection_string(connect_str)
container_client = blob_service_client.get_container_client(container_name)

PyObjectId = Annotated[str, BeforeValidator(str)]

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

class UserRole(Enum):
    SELLER = "seller"
    BUYER = "buyer"

class User(BaseModel):
    username: str
    role: str
    preferences: str
    average_rating: Optional[float] = None
    num_ratings: Optional[int] = None
    # TODO: Do we want rating descriptions? Or just rating values?

    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
        json_encoders={ObjectId: str}
    )

    @property
    def user_role(self) -> UserRole:
        return UserRole(self.role)
    
class SpiceLevel(str, Enum):
    LESS = "less"
    MEDIUM = "medium"
    HOT = "hot"

class NutritionInfo(BaseModel):
    protein: NonNegativeFloat
    carbs: NonNegativeFloat
    fiber: NonNegativeFloat

class Dish(BaseModel):
    id: ObjectId = Field(default_factory=ObjectId, alias="_id")
    title: str
    description: str
    seller_id: Optional[PyObjectId] = Field(alias="seller_id", default=None)
    matched_buyer_id: Optional[PyObjectId] = Field(alias="matched_buyer_id", default=None)
    image_url: str
    tags: str
    nutrition: NutritionInfo
    non_veg: Optional[bool] = Field(default=None)
    spice_level: Optional[SpiceLevel] = Field(default=None)

    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
        json_encoders={ObjectId: str}
    )

class CreateDishResponse(BaseModel):
    id: str

class CreateDishRequest(BaseModel):
    title: str
    description: str
    seller_id: str
    tags: str
    nutrition: NutritionInfo

# Get the database and collection
db = client.get_database("peerplates")
dishes_collection = db.dishes
users_collection = db.users

# Update the in-memory storage to use MongoDB
dishes = list(dishes_collection.find())

# Helper function to convert MongoDB ObjectId to string
def dish_helper(dish):
    if '_id' in dish:
        dish['id'] = str(BsonUUID(dish['_id']))
        dish.pop('_id', None)
    if 'seller_id' in dish:
        dish['seller_id'] = str(BsonUUID(dish['seller_id']))
    return dish

# User endpoints

# Create a user
@app.post("/users", response_model=User)
async def create_user(user: User):
    result = users_collection.insert_one(user.model_dump())
    return user



# Seller endpoints
# Create a dish
@app.post("/dishes", response_model=CreateDishResponse)
async def create_dish(
    title: Optional[str],
    description: Optional[str],
    seller_id: Optional[str],
    tags: Optional[str],
    protein: Optional[float],
    carbs: Optional[float],
    fiber: Optional[float],
    non_veg: Optional[bool],
    spice_level: Optional[SpiceLevel],
    image: UploadFile = File(...)
):
    # Generate a unique filename for the image
    image_filename = image.filename+str(uuid.uuid4())
    
    # Upload the image to Azure Blob Storage
    blob_client = container_client.get_blob_client(image_filename)
    image_content = await image.read()
    blob_client.upload_blob(image_content)
    
    # Get the URL of the uploaded image
    image_url = blob_client.url
    
    nutrition = NutritionInfo(
        protein=protein or 0,
        carbs=carbs or 0,
        fiber=fiber or 0,
    )
    
    new_dish = Dish(
        title=title or "",
        description=description or "",
        seller_id=ObjectId(seller_id) if seller_id else None,
        image_url=image_url,
        tags=tags,
        nutrition=nutrition,
        non_veg=non_veg,
        spice_level=spice_level
    )
    
    result = dishes_collection.insert_one(new_dish.model_dump(by_alias=True))

    # [WORKING] Get the description from Azure OpenAI
    # description = get_description(
    #     title=title,
    #     tags=tags,
    #     protein=protein,
    #     carbs=carbs,
    #     fiber=fiber,
    #     non_veg=non_veg,
    #     spice_level=spice_level,
    #     image_url=image_url
    # )

    # # Update the dish with the description
    # result = dishes_collection.update_one(
    #     {"_id": result.inserted_id},
    #     {"$set": {"description": description}}
    # )

    return CreateDishResponse(id=str(result.inserted_id))

# Update a dish
@app.put("/dishes/{dish_id}", response_model=Dish)
async def update_dish(dish_id: UUID, updated_dish: Dish):
    result = dishes_collection.update_one({"_id": dish_id}, {"$set": updated_dish.dict()})
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Dish not found")
    return dish_helper(dishes_collection.find_one({"_id": dish_id}))

# Buyer endpoints

@app.get("/dishes", response_model=List[Dish])
async def list_dishes(
    preferences: str
):
    return get_all_dishes()

    # result = generate_response(
    #     prompt=preferences,
    #     task="recommend",
    # )
    
    # object_ids = [ObjectId(id_str) for id_str in result]
    
    # # Fetch dishes in the same order as the result list
    # dishes = [dishes_collection.find_one({"_id": obj_id}) for obj_id in object_ids]
    
    # return [dish for dish in dishes if dish is not None]

@app.get("/get_description", response_model=str)
async def get_description(
    title: str,
    tags: Optional[str] = None,
    protein: Optional[float] = None,
    carbs: Optional[float] = None,
    fiber: Optional[float] = None,
    non_veg: Optional[bool] = None,
    spice_level: Optional[SpiceLevel] = None,
    image_url: Optional[str] = None,
):
    
    image_url = image_url or "https://vthackspeerplates.blob.core.windows.net/peerplatesimages/1fac77ee-e66f-45ea-a9b8-a76023c75612.JPGd0456e15-1cd7-4d3d-8f26-332d13fe7b3e"
    prompt = f"title: {title}"
    if tags:
        prompt += f", tags: {tags}"
    if protein:
        prompt += f", protein: {protein}"
    if carbs:
        prompt += f", carbs: {carbs}"
    if fiber:
        prompt += f", fiber: {fiber}"
    if non_veg:
        prompt += f", non_veg: {non_veg}"
    if spice_level:
        prompt += f", spice_level: {spice_level.value}"

    response = analyze_image_with_prompt(
        image_url=image_url,
        prompt=prompt
    )
    
    return response

@app.get("/dishes/{dish_id}", response_model=Dish)
async def get_dish(dish_id: str):
    dish = dishes_collection.find_one({"_id": dish_id})
    if not dish:
        raise HTTPException(status_code=404, detail="Dish not found")
    
    return dish

@app.post("/match/{dish_id}/{buyer_id}")
async def match_buyer_with_dish(dish_id: str, buyer_id: str):
    # Validate ObjectIds
    try:
        dish_obj_id = ObjectId(dish_id)
        buyer_obj_id = ObjectId(buyer_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid dish_id or buyer_id")

    # Check if the dish exists and is not already matched
    dish = dishes_collection.find_one({"_id": dish_obj_id, "matched_buyer_id": None})
    if not dish:
        raise HTTPException(status_code=404, detail="Dish not found or already matched")

    # Check if the buyer exists and is a buyer
    buyer = users_collection.find_one({"_id": buyer_obj_id, "role": UserRole.BUYER.value})
    if not buyer:
        raise HTTPException(status_code=404, detail="Buyer not found or not a buyer")

    # Update the dish with the matched buyer
    result = dishes_collection.update_one(
        {"_id": dish_obj_id},
        {"$set": {"matched_buyer_id": buyer_obj_id}}
    )

    if result.modified_count == 0:
        raise HTTPException(status_code=500, detail="Failed to update dish")

    return {"message": "Match successful", "dish_id": str(dish_obj_id), "buyer_id": str(buyer_obj_id)}

# Add rating to the user
@app.post("/add_rating/{user_id}")
async def add_rating(user_id: str, rating: float):

    current_user = users_collection.find_one({"_id": user_id})
    if not current_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    average_rating = current_user.get("average_rating", 0)
    num_ratings = current_user.get("num_ratings", 0)

    new_num_ratings = num_ratings + 1
    new_average_rating = (average_rating + rating)/new_num_ratings

    result = users_collection.update_one(
        {"_id": user_id},
        {"$set": {"average_rating": new_average_rating, "num_ratings": new_num_ratings}}
    )

    if result.modified_count == 0:
        raise HTTPException(status_code=500, detail="Failed to update user")

    return {"message": "Rating added successfully", "average_rating": new_average_rating, "num_ratings": new_num_ratings}   
        

# add api to communicate with azure openai
@app.post("/ask_gpt4")
async def ask_gpt4(prompt: str, task: str, context: str = None):
    response = generate_response(
        user_prompt=prompt,
        task=task,
        context=context
    )

    return response

@app.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: str):
    await chat_endpoint(websocket, user_id)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)