from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
import os
import requests

load_dotenv()

TOGETHER_API_KEY = os.getenv("TOGETHER_API_KEY")
TOGETHER_API_URL = "https://api.together.xyz/v1/chat/completions"

app = FastAPI(title="API con FastAPI y Meta-Llama-3-8B-Instruct (Together AI)")

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
async def query_together(request: QueryRequest):
    headers = {
        "Authorization": f"Bearer {TOGETHER_API_KEY}",
        "Content-Type": "application/json"
    }
    data = {
        "model": "meta-llama/Meta-Llama-3-8B-Instruct",
        "messages": [
            {"role": "user", "content": request.query}
        ],
        "max_tokens": 256,
        "temperature": 0.7
    }
    try:
        response = requests.post(TOGETHER_API_URL, headers=headers, json=data)
        response.raise_for_status()
        result = response.json()
        answer = result["choices"][0]["message"]["content"]
        return {"response": answer}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al procesar la solicitud: {str(e)}")

@app.get("/hola")
async def hola_mundo():
    return {"message": "Hola mundo, el server funca"}

@app.get("/")
async def root():
    return {"message": "API con FastAPI y Meta-Llama-3-8B-Instruct (Together AI) funcionando"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
