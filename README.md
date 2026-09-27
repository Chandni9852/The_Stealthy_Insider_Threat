# 🔒 The Stealthy Insider Threat

A full-stack insider threat detection system that combines **behavioral anomaly detection** (Isolation Forest) with **SHA-256 file integrity monitoring** to flag suspicious user activity and unauthorized file tampering.

**Live demo:** https://the-stealthy-insider-threat.vercel.app
**Backend API:** https://the-stealthy-insider-threat.onrender.com

> ⚠️ Hosted on free-tier infrastructure — the backend may take 30–50 seconds to respond on first request after a period of inactivity (cold start).

---

## What it does

1. **Upload** login and file-access logs (CSV) through the dashboard
2. **Preprocess** — merges and cleans both logs into a unified timeline
3. **Detect anomalies** — an Isolation Forest model, trained on engineered behavioral features, flags unusual activity
4. **Correlate** — groups flagged events by user, so an investigator knows *who* to prioritize, not just *what* happened
5. **Monitor file integrity** — SHA-256 hashes of registered files are compared against a stored baseline to catch unauthorized edits
6. **Visualize** — a dashboard shows anomaly breakdowns, threat-level radar charts, per-user activity, and a breach event timeline

---

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React, custom CSS (light/dark theme) |
| Backend | FastAPI (Python) |
| ML | scikit-learn (Isolation Forest) |
| Hosting | Vercel (frontend), Render (backend) |

---

## Anomaly detection: features & methodology

The model doesn't use a fixed rule (e.g. "flag anything after 8 PM") — it learns from **six behavioral features** engineered per event:

- `hour` — hour of day
- `day_of_week`
- `daily_access_count` — how many events this user generated that day (burst detection)
- `hour_deviation` — how far this event is from *that specific user's* typical hour (a personalized baseline, not a global cutoff)
- `distinct_ips_per_day` — number of distinct machines/IPs the user touched that day
- `is_off_hours` — used as one signal among several, not the sole rule

**Evaluation:** Isolation Forest is unsupervised, so there's no ground truth to score precision/recall against directly. This project evaluates using **synthetic injected anomalies** — a standard technique when labeled real-world anomaly data isn't available: known-anomalous events (odd hours for a specific user, abnormal frequency, multiple devices) are injected and labeled, then measured against the model's output. This gave **~97% precision and recall** on held-out injected anomalies — a proxy for real-world performance, not a substitute for it.

**Dataset:** [CERT Insider Threat Test Dataset (r4.2)](https://www.cert.org/insider-threat/tools/) — Carnegie Mellon University's Software Engineering Institute, a synthetic-but-realistic dataset simulating ~1,000 employees' logon activity over 18 months, purpose-built for insider threat research. The live demo uses a small, curated subset (a few hundred rows with planted anomalies) rather than the full ~850,000-row dataset, to keep detection fast and reliable on free-tier hosting — the model and features are identical either way.

---

## File integrity monitoring

- `sample_files/confidential.txt` is registered with a baseline SHA-256 hash
- `GET /tamper-check` recomputes the hash and compares it to the baseline
- Demo-only helper endpoints let you see this work live:
  - `GET /simulate-tampering` — genuinely modifies the monitored file
  - `GET /reset-integrity-baseline` — resets the baseline back to "clean" so the demo can be repeated

---

## Running locally

**Backend:**
```bash
cd insider_breach_backend
pip install -r requirements.txt
uvicorn main:app --reload
```

**Frontend:**
```bash
cd insider_breach_frontend
npm install
npm start
```
The frontend defaults to `http://127.0.0.1:8000` for the API when no `REACT_APP_API_URL` environment variable is set.

---

## API endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/upload/` | Upload login + file-access log CSVs |
| POST | `/process/` | Run full pipeline: preprocess → detect anomalies → correlate → check tampering |
| GET | `/breach-events/` | Correlated, per-user anomaly summary |
| GET | `/tamper-check` | Run file integrity check |
| GET | `/download/{filename}` | Download a generated CSV (e.g. `anomalies.csv`, `tampered_files.csv`) |
| GET | `/simulate-tampering` | Demo helper: modifies the monitored file |
| GET | `/reset-integrity-baseline` | Demo helper: resets the integrity baseline |

---

## Known limitations

- Free-tier hosting caps uploads at 15,000 rows and may cold-start slowly
- Precision/recall figures are measured against synthetic injected anomalies, not the dataset's real labeled red-team scenarios
- Not yet containerized; no CI/CD pipeline

---

## Author

Built by Chandni Upreti — [GitHub](https://github.com/Chandni9852)
