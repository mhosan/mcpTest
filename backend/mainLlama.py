from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
import os
import requests

load_dotenv()

HUGGINGFACE_API_KEY = os.getenv("HUGGINGFACE_API_KEY")
# Usamos el modelo Meta Llama 3 (8B Instruct)
HUGGINGFACE_API_URL = "https://api-inference.huggingface.co/models/meta-llama/Meta-Llama-3-8B-Instruct"

app = FastAPI(title="API con FastAPI y Meta Llama 3")

# Configuración de CORS para permitir requests desde el frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

class QueryRequest(BaseModel):
    query: str

@app.post("/query")
async def query_llama(request: QueryRequest):
    headers = {
        "Authorization": f"Bearer {HUGGINGFACE_API_KEY}",
        "Content-Type": "application/json"
    }
    data = {
        "inputs": request.query,
        "parameters": {"max_new_tokens": 256, "temperature": 0.7},
        "options": {"wait_for_model": True}
    }
    try:
        response = requests.post(HUGGINGFACE_API_URL, headers=headers, json=data)
        response.raise_for_status()
        result = response.json()
        if isinstance(result, list) and len(result) > 0 and 'generated_text' in result[0]:
            answer = result[0]['generated_text']
        elif isinstance(result, dict) and 'generated_text' in result:
            answer = result['generated_text']
        elif isinstance(result, list) and len(result) > 0 and 'generated_text' in result[-1]:
            answer = result[-1]['generated_text']
        else:
            answer = str(result)
        return {"response": answer}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al procesar la solicitud: {str(e)}")

@app.get("/hola")
async def hola_mundo():
    return {"message": "Hola mundo, el server funca"}

@app.get("/")
async def root():
    return {"message": "API con FastAPI y Meta Llama 3 funcionando"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
