import os
from azure.ai.vision.imageanalysis import ImageAnalysisClient
from azure.ai.vision.imageanalysis.models import VisualFeatures
from azure.core.credentials import AzureKeyCredential
from dotenv import load_dotenv
from openai import AzureOpenAI

load_dotenv()

# Azure Computer Vision configuration
VISION_ENDPOINT = os.getenv("VISION_ENDPOINT")
VISION_KEY = os.getenv("VISION_KEY")

# Azure OpenAI configuration
OPENAI_API_KEY = os.getenv("AZURE_OPENAI_API_KEY")
OPENAI_ENDPOINT = os.getenv("AZURE_ENDPOINT")
OPENAI_DEPLOYMENT_NAME = os.getenv("vthacks-gpt4")

VISION_SYSTEM_PROMPT = """
You are a helpful AI assistant called PeerPlates. A user will provide you with an image. 
Get a description of the image and extract nutrients, calories (estimate numbers), macros and 
other relevant information. Include all important nutrients while making it concise. (2-3 sentence). 
Return only the paragraph. No additional text."""

# Create an Image Analysis client
vision_client = ImageAnalysisClient(
    endpoint=VISION_ENDPOINT,
    credential=AzureKeyCredential(VISION_KEY)
)

# Create an Azure OpenAI client
openai_client = AzureOpenAI(
    api_key=OPENAI_API_KEY,
    api_version="2023-05-15",
    azure_endpoint=OPENAI_ENDPOINT
)

def analyze_image_with_prompt(image_url, prompt):
    # Get image analysis from Azure Computer Vision
    vision_result = vision_client.analyze_from_url(
        image_url=image_url,
        visual_features=[VisualFeatures.CAPTION, VisualFeatures.TAGS, VisualFeatures.OBJECTS],
        gender_neutral_caption=True,
    )

    # Prepare the input for Azure OpenAI
    caption = vision_result.caption.text if vision_result.caption else ""
    tags = ", ".join([tag for tag in vision_result.tags]) if vision_result.tags else ""
    objects = ", ".join([obj for obj in vision_result.objects]) if vision_result.objects else ""

    input_text = f"Image caption: {caption}"
    if tags:
        input_text += f"\nTags: {tags}"
    if objects:
        input_text += f"\nObjects: {objects}"
    
    input_text += f"\n\nAdditional information: {prompt}"

    # Get detailed analysis from Azure OpenAI
    openai_response = openai_client.chat.completions.create(
        model=OPENAI_DEPLOYMENT_NAME,
        messages=[
            {"role": "system", "content": VISION_SYSTEM_PROMPT},
            {"role": "user", "content": input_text}
        ],
        max_tokens=100
    )

    print(openai_response.choices[0].message.content)
    return openai_response.choices[0].message.content
