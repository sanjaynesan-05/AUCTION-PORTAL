import pandas as pd
import os

try:
    df = pd.read_excel("IPL_2025_FINAL_OUTPUT.xlsx")
    print(df.columns.tolist())
    print(df.head())
except Exception as e:
    print(f"Error: {e}")
