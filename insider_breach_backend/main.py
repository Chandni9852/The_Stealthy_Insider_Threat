from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os
import pandas as pd
import sys

# ✅ Define app before anything else
app = FastAPI()

# ✅ Apply CORS immediately
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3003", "http://127.0.0.1:3003"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Local module path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# ✅ Imports from models
from models.preprocessor import preprocess_logs
from models.file_integrity import create_registry, check_for_tampering
from models.anomaly_detector import detect_anomalies
from models.correlator import correlate_events

# ✅ Create hash registry ONLY ONCE
@app.on_event("startup")
def setup_hash_registry():
    os.makedirs("sample_files", exist_ok=True)
    os.makedirs("data", exist_ok=True)
    if not os.path.exists("data/hash_registry.csv"):
        create_registry(["sample_files/confidential.txt"])

# ✅ Health check
@app.get("/")
def read_root():
    return {"message": "Insider Breach Detection API is running."}

# ✅ Upload endpoint
@app.post("/upload/")
async def upload_logs(
    login_file: UploadFile = File(...),
    filelog_file: UploadFile = File(...)
):
    os.makedirs("data", exist_ok=True)
    with open("data/login_logs.csv", "wb") as f:
        f.write(await login_file.read())
    with open("data/file_access_logs.csv", "wb") as f:
        f.write(await filelog_file.read())
    return {"message": "Log files uploaded successfully."}

# ✅ Detection pipeline
@app.post("/process/")
def run_pipeline():
    preprocess_logs()
    detect_anomalies()
    correlate_events()
    check_for_tampering()
    return {"message": "Logs processed. Breach events generated."}

# ✅ Breach event timeline
@app.get("/breach-events/")
def get_breach_events():
    path = "data/correlated_breach_events.csv"
    if not os.path.exists(path):
        return []
    df = pd.read_csv(path)
    return df.to_dict(orient="records")

# ✅ Tampering check
@app.get("/tamper-check")
def run_tamper_check():
    check_for_tampering()
    path = "data/tampered_files.csv"
    if os.path.exists(path):
        df = pd.read_csv(path)
        return df.to_dict(orient="records")
    return {"message": "✅ No file tampering detected."}

# ✅ Mount /data folder for downloads
app.mount("/data", StaticFiles(directory="data"), name="data")

# ✅ Optional: download endpoint
@app.get("/download/{filename}")
def download_csv(filename: str):
    path = f"data/{filename}"
    if os.path.exists(path):
        return FileResponse(path, media_type='text/csv', filename=filename)
    return {"error": "File not found"}
