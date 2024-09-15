import json
import os
import requests
import os
from dotenv import load_dotenv
from db import client


SYSTEM_PROMPTS = {
    "summarize": """
    You are a helpful AI assistant called PeerPlates. A user will give you the ingredients, recipe, details about their food and your task 
    is to summarize it by capturing all the important information about the food and provide a short description of the food. 
    Only return the summary without any additional boilerplate text. Just give me the short summary description.""",
    "describe": 
    """You are a helpful AI assistant called PeerPlates. Based on the provided information, describe the food, how it's made, its nutritional value, calories, and more. 
    Base your answer on the user's input and provide a detailed description and analysis of the food (No more than 60 words). Only return the description and analysis, 
    no additional text.""",
    "chat": 
    """You are a helpful AI assistant called PeerPlates. A user will ask you a question and your task is to answer the question based on the user's input. 
    You will have a reference to base your answers from. Only use the factual information given as context to answer the questions. 
    If the provided context does not contain the answer, say so. Only return the answer to the question, no additional text.""",
    "recommend":
    """
	You are a helpful AI assistant called PeerPlates. A user will provide the preference of food they like to eat. You should compare with other dishes 
	description and sort them based on the user's preference. Consider the nutritional value, calories, ingredients, and more. The most relevant dishes 
	should be ranked higher and the least related ones ranked lower but all of them should be listed out in their order. Only return the list of food code 
	separated by comma (food_id_1, food_id_2, food_id_3, ...). No additional text.""",
}

def get_id_mapping(dishes):
    # Map uuid dish_id using food_id_1, food_id_2, food_id_3, etc.
    id_mapping = {}
    for i, dish in enumerate(dishes):
        id_mapping[dish['_id']] = f"food_id_{i+1}"

    return id_mapping

def format_dishes_with_new_ids(dishes, id_mapping):
    dishes_dict = {id_mapping[dish['_id']]: dish['description'] for dish in dishes}

    return dishes_dict

def get_all_dishes():
    db = client.get_database('peerplates')
    collection = db.get_collection('dishes')
    dishes = list(collection.find())

    return dishes

def construct_payload(user_prompt: str, task: str, title: str = None, tags: str = None, details: str = None, all_dishes: dict = None):
    system_prompt = SYSTEM_PROMPTS[task]
    
    if task == "recommend":
        user_prompt = f"Here is the user's preference:\n{user_prompt}\n\n"
        for food_id, desc in all_dishes.items():
            user_prompt += f"Here is the list of dishes:\n\n{food_id}\n {desc}\n\n"
    elif task == "describe":
        user_prompt = f"Here is the title of the dish:\n{title}\n\nHere is the tags of the dish:\n{tags}\n\nHere is the details of the dish:\n{details}\n\n"
        
    return {
        "messages": [
            {
                "role": "system",
				"content": [
					{
						"type": "text",
						"text": system_prompt
					}
                ]
            },
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": user_prompt
                    }
                ]
            }
        ],
        "temperature": 0.3,
        "top_p": 0.95,
        "max_tokens": 30
    }

def get_azure_credentials():
    load_dotenv()
    return {
        "api_key": os.getenv("AZURE_OPENAI_API_KEY"),
        "endpoint": os.getenv("AZURE_ENDPOINT")
    }

def send_azure_request(payload):
    credentials = get_azure_credentials()
    headers = {
        "Content-Type": "application/json",
        "api-key": credentials["api_key"],
    }
    try:
        response = requests.post(credentials["endpoint"], headers=headers, json=payload)
        response.raise_for_status()
        return response.json()['choices'][0]['message']['content']
    except requests.RequestException as e:
        raise SystemExit(f"Failed to make the request. Error: {e}")


def describe_food(title, tags, details):
    payload = construct_payload("", "describe", title, tags, details)
    # return send_azure_request(payload)
    return "This is a test response"

def recommend_food(preference):
    all_dishes = get_all_dishes()
    id_mapping_dict = get_id_mapping(all_dishes)
    formatted_dishes = format_dishes_with_new_ids(all_dishes, id_mapping_dict)
    payload = construct_payload(preference, "recommend", all_dishes=formatted_dishes)
    # response_text = send_azure_request(payload)
    response_text = "food_id_2, food_id_1"
    sorted_food_ids = response_text.split(",")
    reverse_id_mapping_dict = {v: k for k, v in id_mapping_dict.items()}
    return [reverse_id_mapping_dict.get(food_id.strip()) for food_id in sorted_food_ids]

def generate_response(prompt: str, task: str, title: str = None, tags: str = None, details: str = None):
    assert task in SYSTEM_PROMPTS, f"Task must be one of {SYSTEM_PROMPTS.keys()}"

    if task == "describe":
        return describe_food(title, tags, details)
    elif task == "recommend":
        return recommend_food(prompt)


