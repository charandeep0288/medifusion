import psycopg2
import os

# Database connection parameters
DB_HOST = "db.your-project-id.supabase.co"
DB_PORT = "5432"
DB_NAME = "postgres"
DB_USER = "postgres"
DB_PASSWORD = "medifusion@2025"  # From Supabase settings

def connect_to_supabase():
    try:
        connection = psycopg2.connect(
            host=DB_HOST,
            port=DB_PORT,
            database=DB_NAME,
            user=DB_USER,
            password=DB_PASSWORD
        )
        return connection
    except Exception as e:
        print(f"Error connecting to database: {e}")
        return None

# Example usage
def execute_query():
    conn = connect_to_supabase()
    print("Connected to Supabase database successfully.")
    if conn:
        cursor = conn.cursor()
        
        # Execute query
        cursor.execute("SELECT * FROM patients LIMIT 10;")
        results = cursor.fetchall()
        
        for row in results:
            print(row)
        
        cursor.close()
        conn.close()