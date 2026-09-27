import hashlib
import os
import pandas as pd

def hash_file(file_path):
    h = hashlib.sha256()
    with open(file_path, 'rb') as file:
        while chunk := file.read(4096):
            h.update(chunk)
    return h.hexdigest()

def create_registry(file_paths):
    records = []
    for path in file_paths:
        if os.path.exists(path):
            records.append({
                "file_path": path,
                "hash": hash_file(path)
            })
    df = pd.DataFrame(records)
    df.to_csv("data/hash_registry.csv", index=False)
    print("✅ hash_registry.csv created.")

def check_for_tampering():
    registry_path = "data/hash_registry.csv"
    if not os.path.exists(registry_path):
        print("⚠️ hash_registry.csv not found.")
        return

    registry = pd.read_csv(registry_path)
    tampered = []

    for _, row in registry.iterrows():
        path = row["file_path"]
        current = hash_file(path)
        if current != row["hash"]:
            tampered.append({
                "file_path": path,
                "original_hash": row["hash"],
                "current_hash": current,
                "status": "tampered"
            })

    if tampered:
        pd.DataFrame(tampered).to_csv("data/tampered_files.csv", index=False)
        print("🛑 File tampering detected!")
    else:
        # Always write a file, even when clean, so downloads never 404
        pd.DataFrame(columns=["file_path", "original_hash", "current_hash", "status"]).to_csv(
            "data/tampered_files.csv", index=False)
        print("✅ No tampering detected.")


