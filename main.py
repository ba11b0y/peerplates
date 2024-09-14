import itertools
from fastapi import FastAPI, HTTPException, UploadFile, File
from pydantic import BaseModel, Field
from typing import List, Optional
from fastapi import FastAPI, HTTPException, UploadFile, File
from pydantic import BaseModel, Field, BeforeValidator, ConfigDict, NonNegativeFloat
from typing import List, Optional, Annotated
from uuid import UUID
from db import client
from bson import ObjectId
import base64
import uvicorn
from bson.binary import UUID as BsonUUID
from typing import Optional, Annotated
from enum import Enum
from azure import generate_response

PyObjectId = Annotated[str, BeforeValidator(str)]

app = FastAPI()

class UserRole(Enum):
    SELLER = "seller"
    BUYER = "buyer"

class User(BaseModel):
    username: str
    role: str
    preferences: Optional[dict] = None
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
    image_base64 = None
    if image:
        image_content = await image.read()
        image_base64 = base64.b64encode(image_content).decode('utf-8')
    
    
    nutrition = NutritionInfo(
        protein=protein or 0,
        carbs=carbs or 0,
        fiber=fiber or 0,
    )
    
    new_dish = Dish(
        title=title or "",
        description=description or "",
        seller_id=ObjectId(seller_id) if seller_id else None,
        image_url=f"data:image/jpeg;base64,{image_base64}" if image_base64 else None,
        tags=tags,
        nutrition=nutrition,
        non_veg=non_veg,
        spice_level=spice_level
    )
    
    result = dishes_collection.insert_one(new_dish.model_dump(by_alias=True))
    return CreateDishResponse(id=str(result.inserted_id))

# Update a dish
@app.put("/dishes/{dish_id}", response_model=Dish)
async def update_dish(dish_id: UUID, updated_dish: Dish):
    result = dishes_collection.update_one({"_id": dish_id}, {"$set": updated_dish.dict()})
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Dish not found")
    return dish_helper(dishes_collection.find_one({"_id": dish_id}))

# Buyer endpoints

# List all dishes
# TODO: Add an intelligent filter for dishes based on the user's preferences
@app.get("/dishes", response_model=List[Dish])
async def list_dishes(
    spice_level: Optional[str] = None,
    vegetarian: Optional[bool] = None,
    halal: Optional[bool] = None
):
    filtered_dishes = dishes        # Where is dishes defined? Read from db?
    dishes_result = []              # a list to store the dishes that match the criteria
    if spice_level:
        filtered_dishes = [dish for dish in filtered_dishes if any(tag.name == spice_level for tag in dish.tags)]
        dishes_result.append(filtered_dishes)
    if vegetarian is not None:
        filtered_dishes = [dish for dish in filtered_dishes if any(tag.name == "vegetarian" for tag in dish.tags) == vegetarian]
        dishes_result.append(filtered_dishes)
    if halal is not None:
        filtered_dishes = [dish for dish in filtered_dishes if any(tag.name == "halal" for tag in dish.tags) == halal]
        dishes_result.append(filtered_dishes)
    
    dishes_result = list(itertools.chain(*dishes_result))

    return dishes_result          # return a list of dishes that match the criteria

# A dish feed for a user
# @app.get("/dishes/", response_model=List[Dish])
# async def list_dishes(
#     spice_level: Optional[str] = None,
#     vegetarian: Optional[bool] = None,
#     halal: Optional[bool] = None
# ):
#     query = {}
#     if spice_level:
#         query["tags.name"] = spice_level
#     if vegetarian is not None:
#         query["tags.name"] = "vegetarian" if vegetarian else {"$ne": "vegetarian"}
#     if halal is not None:
#         query["tags.name"] = "halal" if halal else {"$ne": "halal"}
    
#     dishes = list(dishes_collection.find(query))
#     return [dish_helper(dish) for dish in dishes]



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


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)