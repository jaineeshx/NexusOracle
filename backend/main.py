from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from models import UserOnboard, FanDNA, Quest, Prediction, OracleWarStats
import random
import uuid
import os

app = FastAPI(title="Nexus Oracle API")

# Allow CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve the static files of the React app
app.mount("/assets", StaticFiles(directory="static/assets"), name="assets")

@app.get("/")
async def serve_frontend():
    return FileResponse("static/index.html")

# In-memory stores for demo
users_db = {}
predictions_db = []

@app.post("/api/onboard", response_model=FanDNA)
async def onboard_user(data: UserOnboard):
    """
    Mock endpoint simulating Gemini analyzing user history to create a Fan DNA profile.
    """
    # Simulate Gemini logic
    dna_types = ["Contrarian Genius", "Aggressive Streaker", "Calculated Sniper", "Loyal Optimist"]
    guilds = ["The Silver Seers", "Iron Forecasters", "Void Prophets"]
    
    selected_dna = random.choice(dna_types)
    
    fan_dna = FanDNA(
        dna_type=selected_dna,
        description=f"Your history shows you are a {selected_dna}. You thrive when the odds are against you.",
        guild=random.choice(guilds),
        ai_rival_name=f"Shadow_{data.username}"
    )
    
    users_db[data.username] = fan_dna.dict()
    return fan_dna

@app.get("/api/quests/{username}", response_model=list[Quest])
async def get_quests(username: str):
    """
    Mock endpoint simulating Cloud Scheduler + Gemini generating daily quests based on Fan DNA.
    """
    if username not in users_db and username != "testuser":
        # Provide default quests if user not strictly onboarded in this session yet
        pass
        
    return [
        Quest(
            id=str(uuid.uuid4())[:8],
            title="Halftime Prophet",
            description="Correctly predict the exact score at halftime for today's match.",
            reward_xp=500,
            completed=False
        ),
        Quest(
            id=str(uuid.uuid4())[:8],
            title="Streak Keeper",
            description="Maintain a 3-prediction win streak to feed your Oracle.",
            reward_xp=1000,
            completed=False
        )
    ]

@app.post("/api/predict")
async def submit_prediction(prediction: Prediction):
    """
    Submit a prediction. In real life, this goes to Pub/Sub -> BigQuery -> Vertex AI.
    """
    predictions_db.append(prediction.dict())
    return {"status": "success", "message": "Prediction submitted to the Oracle network.", "oracle_fed": True}

@app.get("/api/oracle-war", response_model=OracleWarStats)
async def get_oracle_war():
    """
    Mock real-time stats of the Oracle War.
    """
    # Simulate slightly fluctuating scores for the demo
    base_a = 82.5
    base_b = 78.1
    
    fluctuation_a = random.uniform(-1.0, 1.5)
    fluctuation_b = random.uniform(-1.5, 1.0)
    
    return OracleWarStats(
        team_a_name="Cyber Knights",
        team_b_name="Neon Strikers",
        team_a_oracle_score=round(base_a + fluctuation_a, 1),
        team_b_oracle_score=round(base_b + fluctuation_b, 1),
        top_contributors=["AlexV", "Prophet99", "Sarah_Sniper"]
    )

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=False)

@app.exception_handler(404)
async def custom_404_handler(request, exc):
    return FileResponse("static/index.html")
