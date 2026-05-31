import os
import sys

# Add the ai-service directory to the path
sys.path.append(os.path.join(os.path.dirname(__file__), "..", "ai-service"))

from ai_service.main import app
