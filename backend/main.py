from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from openai import OpenAI, OpenAIError
import os
import logging
import traceback
import json

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Verify API key is present
api_key = os.getenv("OPENAI_API_KEY")
if not api_key:
    raise ValueError("OPENAI_API_KEY not found in environment variables")
else:
    logger.info("API key found in environment variables")
    logger.info(f"API key starts with: {api_key[:8]}")

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],  # Angular default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str

@app.get("/")
async def hello_world():
    return {"message": "Hola mundooooooo"}

@app.post("/chat")
async def chat(request: ChatRequest):
    try:
        logger.info(f"Received message: {request.message}")
        
        # Initialize the OpenAI client
        client = OpenAI(
            api_key=api_key,
            organization=None  # Add this if you have an organization ID
        )
        
        try:
            # Test the API key with a simple models list request
            logger.info("Testing API connection...")
            models = client.models.list()
            logger.info("API connection successful")
        except Exception as e:
            logger.error(f"Error testing API connection: {str(e)}")
            if "Invalid API key" in str(e):
                raise HTTPException(status_code=500, detail="Invalid API key provided")
            raise
        
        # Create chat completion
        logger.info("Sending request to OpenAI")
        try:
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": request.message}],
                temperature=0.7
            )
            logger.info("Received response from OpenAI")
            
            # Extract the response content
            message = response.choices[0].message.content
            
            return {"message": message}
        except OpenAIError as e:
            logger.error(f"OpenAI API Error: {str(e)}")
            error_dict = json.loads(str(e))
            raise HTTPException(status_code=500, detail=error_dict)
            
    except Exception as e:
        logger.error(f"Error in chat endpoint: {str(e)}")
        logger.error(f"Traceback: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=str(e))
