from pydantic import BaseModel
from typing import List, Optional

class UserOnboard(BaseModel):
    username: str
    fan_history_summary: str  # e.g., "predicts aggressively, loyal to Team A"

class FanDNA(BaseModel):
    dna_type: str
    description: str
    guild: str
    ai_rival_name: str

class Quest(BaseModel):
    id: str
    title: str
    description: str
    reward_xp: int
    completed: bool

class Prediction(BaseModel):
    user_id: str
    match_id: str
    prediction_type: str # e.g., "next_goal", "final_score"
    value: str

class OracleWarStats(BaseModel):
    team_a_name: str
    team_b_name: str
    team_a_oracle_score: float
    team_b_oracle_score: float
    top_contributors: List[str]
