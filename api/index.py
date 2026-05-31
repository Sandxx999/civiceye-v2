import os
import sys

# Add the backend directory to the path so we can import the app
sys.path.append(os.path.join(os.path.dirname(__file__), "..", "backend"))
sys.path.append(os.path.join(os.path.dirname(__file__), "..", "backend", "app"))

from backend.app import create_app

app = create_app()
