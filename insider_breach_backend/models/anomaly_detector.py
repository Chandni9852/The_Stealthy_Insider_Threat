import pandas as pd
import os

def detect_anomalies():
    input_path = "data/cleaned_logs.csv"
    output_path = "data/anomalies.csv"

    if not os.path.exists(input_path):
        print("❌ Cleaned log file not found.")
        return

    df = pd.read_csv(input_path)
    df['is_anomalous'] = df['hour'].apply(lambda h: 1 if h < 6 or h > 20 else 0)

    df['anomaly_reason'] = df.apply(
        lambda row: "Suspicious login hour" if row['is_anomalous'] == 1 and row['event_type'] == 'login'
        else "Suspicious file access" if row['is_anomalous'] == 1 and row['event_type'] == 'file_access'
        else "Normal",
        axis=1
    )

    anomalies = df[df['is_anomalous'] == 1]
    anomalies.to_csv(output_path, index=False)
    print(f"✅ Detected {len(anomalies)} anomalies. Saved to {output_path}")
