# qa_engine.py

import requests
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"
# Valid Groq models: "llama3-8b-8192", "llama3-70b-8192", "gemma-7b-it"
MODEL = "llama3-70b-8192"  # Using a more powerful model as replacement for mixtral

def answer_question(context, question):
    if not GROQ_API_KEY:
        raise ValueError("GROQ_API_KEY environment variable is not set")
        
    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }

    # Make sure context isn't too long for the model's context window
    max_context_length = 25000  # Adjust based on model's capabilities
    if len(context) > max_context_length:
        context = context[:max_context_length] + "..."

    payload = {
        "model": MODEL,
        "messages": [
            {"role": "system", "content": "You are an assistant that answers questions based on provided context."},
            {"role": "user", "content": f"Context:\n{context}\n\nQuestion: {question}"}
        ],
        "temperature": 0.7,
        "max_tokens": 1000
    }

    # Debug: Print the request payload
    print(f"Request payload: {payload}")

    try:
        response = requests.post(GROQ_URL, headers=headers, json=payload)
        
        # Debug: Print the response status and content
        print(f"Response status: {response.status_code}")
        print(f"Response content: {response.text[:500]}...")  # Print first 500 chars
        
        response.raise_for_status()  # Raise an exception for HTTP errors
        result = response.json()
        
        if "choices" not in result or len(result["choices"]) == 0:
            raise ValueError(f"Unexpected response from Groq API: {result}")
            
        return result["choices"][0]["message"]["content"]
    except requests.exceptions.RequestException as e:
        # Print the full error for debugging
        print(f"Request error details: {str(e)}")
        if hasattr(e, 'response') and e.response is not None:
            print(f"Response content: {e.response.text}")
        raise ValueError(f"Error communicating with Groq API: {str(e)}")
    except (KeyError, IndexError, ValueError) as e:
        raise ValueError(f"Error processing Groq API response: {str(e)}")
