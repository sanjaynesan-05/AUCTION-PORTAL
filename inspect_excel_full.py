import pandas as pd
try:
    df = pd.read_excel("IPL_2025_FINAL_OUTPUT.xlsx")
    for col in df.columns:
        print(f"COLUMN: {col}")
    print("Example Row:")
    row = df.iloc[0].to_dict()
    for k, v in row.items():
        print(f"{k}: {v}")
except Exception as e:
    print(e)
