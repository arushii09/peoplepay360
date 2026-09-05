import os
import sys

# Add backend directory to sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.seed.seed_data import seed_database

if __name__ == "__main__":
    print("Initializing PeoplePay360 Database...")
    seed_database()
