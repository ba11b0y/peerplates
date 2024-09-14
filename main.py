from fastapi import FastAPI, HTTPException, UploadFile, File
from pydantic import BaseModel, Field
from typing import List, Optional
from uuid import UUID, uuid4
from db import client
from bson import ObjectId
import base64
import uvicorn
from uuid import uuid4
from bson import Binary
from bson.binary import UUID as BsonUUID
from typing import Optional, Annotated
from pydantic import BaseModel, Field, BeforeValidator, ConfigDict

PyObjectId = Annotated[str, BeforeValidator(str)]

app = FastAPI()


class Dish(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    title: str
    description: str
    seller_id: Optional[PyObjectId] = Field(alias="seller_id", default=None)
    image_url: str
    tags: str

    model_config = ConfigDict(
        arbitrary_types_allowed=True,
        json_encoders={ObjectId: str},
        populate_by_name=True
    )

class CreateDishResponse(BaseModel):
    id: str

# Get the database and collection
db = client.get_database("peerplates")
dishes_collection = db.dishes

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


# Seller endpoints
# Create a dish
@app.post("/dishes", response_model=CreateDishResponse)
async def create_dish(
    title: str,
    description: str,
    seller_id: str,
    tags: str,
    image: UploadFile = File(...)
):
    # Read the image file and encode it as base64
    image_content = await image.read()
    image_base64 = base64.b64encode(image_content).decode('utf-8')

    new_dish = Dish(
        title=title,
        description=description,
        seller_id=UUID(seller_id),
        image_url=f"data:image/{image.content_type};base64,{image_base64}",
        tags=tags,
    )
    
    
    result = dishes_collection.insert_one(new_dish.model_dump())
    response = CreateDishResponse(id=str(result.inserted_id))
    return response

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
    filtered_dishes = dishes
    if spice_level:
        filtered_dishes = [dish for dish in filtered_dishes if any(tag.name == spice_level for tag in dish.tags)]
    if vegetarian is not None:
        filtered_dishes = [dish for dish in filtered_dishes if any(tag.name == "vegetarian" for tag in dish.tags) == vegetarian]
    if halal is not None:
        filtered_dishes = [dish for dish in filtered_dishes if any(tag.name == "halal" for tag in dish.tags) == halal]
    return filtered_dishes

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



if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)