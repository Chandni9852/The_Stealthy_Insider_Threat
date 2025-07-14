import pandas as pd
import os

def preprocess_logs():
    login_path = "data/login_logs.csv"
    filelog_path = "data/file_access_logs.csv"

    if not os.path.exists(login_path) or not os.path.exists(filelog_path):
        print("❌ Log files not found.")
        return

    login_df = pd.read_csv(login_path)
    file_df = pd.read_csv(filelog_path)

    login_df['timestamp'] = pd.to_datetime(login_df['timestamp'], errors='coerce')
    file_df['timestamp'] = pd.to_datetime(file_df['timestamp'], errors='coerce')

    login_df['hour'] = login_df['timestamp'].dt.hour
    file_df['hour'] = file_df['timestamp'].dt.hour

    login_df['event_type'] = 'login'
    file_df['event_type'] = 'file_access'

    login_df = login_df.rename(columns={'ip_address': 'ip', 'status': 'action'})
    file_df['ip'] = None
    login_df['file_name'] = None
    file_df['status'] = None

    merged = pd.concat([login_df, file_df], ignore_index=True)
    merged.to_csv("data/cleaned_logs.csv", index=False)

    print("✅ Logs preprocessed and saved.")
