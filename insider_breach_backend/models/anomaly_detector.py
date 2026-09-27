"""
Insider threat anomaly detection using Isolation Forest.

Runs on the merged login + file-access log (data/cleaned_logs.csv), which
preprocessor.py produces with columns: username, timestamp, hour, event_type,
ip, action, file_name, status.

Behavioral features engineered per event:
  - hour                     : hour of day the event occurred
  - day_of_week               : 0-6, captures weekday/weekend patterns
  - daily_access_count        : how many events this user generated that day (burst/frequency)
  - hour_deviation            : deviation from THIS user's own typical hour
                                 (personalized baseline, not a fixed cutoff)
  - distinct_ips_per_day      : distinct IPs/machines used by the user that day
  - is_off_hours              : one signal among several, not the sole rule

Isolation Forest isolates points via random recursive partitioning; anomalies
need fewer splits to isolate (they differ from the majority), so they get a
shorter average path length across the trees -> higher anomaly score.
"""

import pandas as pd
import os
from sklearn.ensemble import IsolationForest

FEATURE_COLS = ["hour", "day_of_week", "daily_access_count",
                "hour_deviation", "distinct_ips_per_day", "is_off_hours"]


def engineer_features(df: pd.DataFrame) -> pd.DataFrame:
    df["timestamp"] = pd.to_datetime(df["timestamp"], errors="coerce")
    df = df.dropna(subset=["timestamp"]).copy()

    df["hour"] = df["timestamp"].dt.hour
    df["day_of_week"] = df["timestamp"].dt.dayofweek
    df["date"] = df["timestamp"].dt.date

    freq = df.groupby(["username", "date"]).size().rename("daily_access_count")
    df = df.join(freq, on=["username", "date"])

    user_mean_hour = df.groupby("username")["hour"].transform("mean")
    df["hour_deviation"] = (df["hour"] - user_mean_hour).abs()

    if "ip" in df.columns:
        df["distinct_ips_per_day"] = df.groupby(
            ["username", "date"])["ip"].transform("nunique")
    else:
        df["distinct_ips_per_day"] = 1
    df["distinct_ips_per_day"] = df["distinct_ips_per_day"].fillna(1)

    df["is_off_hours"] = ((df["hour"] < 6) | (df["hour"] > 20)).astype(int)
    return df


def detect_anomalies(contamination: float = 0.05):
    input_path = "data/cleaned_logs.csv"
    output_path = "data/anomalies.csv"

    if not os.path.exists(input_path):
        print("❌ Cleaned log file not found.")
        return

    df = pd.read_csv(input_path)

    # Render's free tier has very limited CPU/RAM — cap rows so a large upload
    # (e.g. the full ~850k-row CERT dataset) can't hang or crash the demo.
    MAX_ROWS = 15000
    if len(df) > MAX_ROWS:
        df = df.sample(n=MAX_ROWS, random_state=42).reset_index(drop=True)
        print(f"⚠️ Dataset capped to {MAX_ROWS} rows (sampled) for performance.")

    if len(df) < 20:
        # Too little data for Isolation Forest to learn meaningful structure —
        # fall back to the off-hours rule so the demo still returns something.
        df["timestamp"] = pd.to_datetime(df["timestamp"], errors="coerce")
        df["hour"] = df["timestamp"].dt.hour
        df["is_anomalous"] = ((df["hour"] < 6) | (df["hour"] > 20)).astype(int)
        df["anomaly_reason"] = df.apply(
            lambda row: "Suspicious login hour" if row["is_anomalous"] == 1 and row["event_type"] == "login"
            else "Suspicious file access" if row["is_anomalous"] == 1 and row["event_type"] == "file_access"
            else "Normal", axis=1)
        anomalies = df[df["is_anomalous"] == 1]
        anomalies.to_csv(output_path, index=False)
        print(f"⚠️ Small dataset ({len(df)} rows) — used rule-based fallback. Detected {len(anomalies)} anomalies.")
        return

    df = engineer_features(df)
    X = df[FEATURE_COLS].fillna(0)

    model = IsolationForest(n_estimators=200, contamination=contamination, random_state=42)
    model.fit(X)

    df["prediction_raw"] = model.predict(X)                 # -1 = anomaly, 1 = normal
    df["is_anomalous"] = (df["prediction_raw"] == -1).astype(int)
    df["anomaly_score"] = -model.score_samples(X)            # higher = more anomalous

    df["anomaly_reason"] = df.apply(
        lambda row: "Suspicious login pattern" if row["is_anomalous"] == 1 and row["event_type"] == "login"
        else "Suspicious file access pattern" if row["is_anomalous"] == 1 and row["event_type"] == "file_access"
        else "Normal",
        axis=1
    )

    anomalies = df[df["is_anomalous"] == 1]
    anomalies.to_csv(output_path, index=False)
    print(f"✅ Detected {len(anomalies)} anomalies (Isolation Forest). Saved to {output_path}")


if __name__ == "__main__":
    detect_anomalies()
