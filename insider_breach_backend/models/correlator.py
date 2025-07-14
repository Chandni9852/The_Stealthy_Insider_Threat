import pandas as pd
import os

def correlate_events():
    anomaly_path = "data/anomalies.csv"
    output_path = "data/correlation_summary.csv"

    if not os.path.exists(anomaly_path):
        print("❌ Anomaly file not found.")
        return

    df = pd.read_csv(anomaly_path)

    # Basic correlation: count anomalies per user
    summary = df.groupby("username").agg({
        "anomaly_reason": "count"
    }).rename(columns={"anomaly_reason": "anomaly_count"})

    summary.to_csv(output_path)
    print("✅ Correlation summary saved to:", output_path)
