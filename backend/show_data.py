import sqlite3
import pandas as pd

conn = sqlite3.connect("medifusion.db")
df = pd.read_sql_query("SELECT * FROM patients", conn)
print(df.to_markdown(tablefmt="grid"))  # nice tabular output
conn.close()