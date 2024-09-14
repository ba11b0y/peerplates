import os
import requests
import os
from dotenv import load_dotenv


SYSTEM_PROMPTS = {
    "summarize": """
    You are a helpful AI assistant called PeerPlates. A user will give you the ingredients, recipe, details about their food and your task 
    is to summarize it by capturing all the important information about the food and provide a short description of the food. 
    Only return the summary without any additional boilerplate text. Just give me the short summary description.""",
    "describe": 
    """You are a helpful AI assistant called PeerPlates. Based on the user's input, describe the food, how it's made, and its nutritional value. 
    Base your answer on the user's input and provide a very detailed description and analysis of the food (No more than 60 words). Only return the description and analysis, 
    no additional text.""",
    "chat": 
    """You are a helpful AI assistant called PeerPlates. A user will ask you a question and your task is to answer the question based on the user's input. 
    You will have a reference to base your answers from. Only use the factual information given as context to answer the questions. 
    If the provided context does not contain the answer, say so. Only return the answer to the question, no additional text.""",
}

def construct_payload(user_prompt: str, task: str, context: str = None):
    if context:
        system_prompt = f"{SYSTEM_PROMPTS[task]} \nHere is the context: {context}."
    else:
        system_prompt = SYSTEM_PROMPTS[task]
        
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

def generate_response(prompt: str, task: str, context: str = None):
    
    assert task in SYSTEM_PROMPTS, f"Task must be one of {SYSTEM_PROMPTS.keys()}"

    load_dotenv()

    AZURE_OPENAI_API_KEY = os.getenv("AZURE_OPENAI_API_KEY")
    AZURE_ENDPOINT = os.getenv("AZURE_ENDPOINT")

    # Configuration
    headers = {
        "Content-Type": "application/json",
        "api-key": AZURE_OPENAI_API_KEY,
    }

    # Payload for the request
    payload = construct_payload(prompt, task, context)

    # Send request
    try:
        response = requests.post(AZURE_ENDPOINT, headers=headers, json=payload)
        response.raise_for_status()  # Will raise an HTTPError if the HTTP request returned an unsuccessful status code
    except requests.RequestException as e:
        raise SystemExit(f"Failed to make the request. Error: {e}")

    # Handle the response
    response = response.json()
    response_text = response['choices'][0]['message']['content']
    print(response_text)

    return response_text
