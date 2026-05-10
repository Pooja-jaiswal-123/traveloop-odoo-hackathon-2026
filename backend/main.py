from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from groq import Groq
import os
import json
import asyncio
from dotenv import load_dotenv
import uvicorn

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = Groq(api_key=os.environ.get("GROQ_API_KEY"))
MODEL_NAME = "llama-3.1-8b-instant"

@app.get("/")
def read_root():
    return {"status": "Traveloop AI is flying fast!", "port": 8080}

@app.get("/suggest")
async def get_suggestions(city: str):
    try:
        chat_completion = client.chat.completions.create(
            messages=[
                {"role": "system", "content": "You are a travel guide. Return: Activity | Description | Cost"},
                {"role": "user", "content": f"3 activities for {city}"}
            ],
            model=MODEL_NAME,
            temperature=0.7,
        )
        response_text = chat_completion.choices[0].message.content
        lines = [line.strip() for line in response_text.split('\n') if "|" in line]
        return {"city": city, "activities": lines[:3]}
    except Exception as e:
        return {"error": str(e)}

@app.post("/chat")
async def chat_agent(request: Request):
    try:
        data = await request.json()
        user_message = data.get("message", "")
        history = data.get("history", [])

        async def event_generator():
            try:
                stream = client.chat.completions.create(
                    model=MODEL_NAME,
                    messages=[
                        {"role": "system", "content": "You are Traveloop AI. Give fast travel advice."},
                        *history,
                        {"role": "user", "content": user_message}
                    ],
                    stream=True,
                )
                for chunk in stream:
                    if chunk.choices[0].delta.content:
                        content = chunk.choices[0].delta.content
                        # Standard SSE format
                        yield f"data: {json.dumps({'content': content})}\n\n"
                        # Delay ko 0.01 se 0.001 kar diya taaki speed badhe
                        await asyncio.sleep(0.001) 
            except Exception as e:
                yield f"data: {json.dumps({'error': str(e)})}\n\n"

        # ✅ Important: Buffering rokne ke liye headers add kiye hain
        return StreamingResponse(
            event_generator(), 
            media_type="text/event-stream",
            headers={
                "Content-Type": "text/event-stream",
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
                "X-Accel-Buffering": "no", # Nginx ya Proxy buffering off karne ke liye
            }
        )
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8080)