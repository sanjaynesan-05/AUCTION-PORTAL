import pandas as pd
xl = pd.ExcelFile("IPL_2025_FINAL_OUTPUT.xlsx")
for sheet in xl.sheet_names:
    print(f"\n--- SHEET: {sheet} ---")
    df = xl.parse(sheet)
    print(f"COLUMNS: {list(df.columns)}")
    print(f"ROWS: {len(df)}")
    print("FIRST ROW:")
    if not df.empty:
        print(df.iloc[0].to_dict())
