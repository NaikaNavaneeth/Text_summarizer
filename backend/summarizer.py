# summarizer.py

import requests
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")  # store in .env or export before running

GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"
# Valid Groq models: "llama3-8b-8192", "llama3-70b-8192", "gemma-7b-it"
MODEL = "llama3-70b-8192"  # Using a more powerful model as replacement for mixtral

def summarize_text(text: str, method: str, length: str = "medium"):
    if not GROQ_API_KEY:
        raise ValueError("GROQ_API_KEY environment variable is not set")
        
    # Make sure text isn't too long for the model's context window
    max_text_length = 25000  # Adjust based on model's capabilities
    if len(text) > max_text_length:
        text = text[:max_text_length] + "..."
    
    # Adjust prompt based on length parameter
    length_prompt = ""
    if length == "short":
        length_prompt = "Provide a very brief summary in 2-3 sentences."
    elif length == "medium":
        length_prompt = "Provide a concise summary in about 1-2 paragraphs."
    elif length == "detailed":
        length_prompt = "Provide a detailed summary covering all key points."
        
    if method == "extractive":
        prompt = f"Extract the most important sentences from this article. {length_prompt}\n\n{text}"
    else:  # default to abstractive
        prompt = f"Provide a {length} summary of the following article. {length_prompt}\n\n{text}"

    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": MODEL,
        "messages": [
            {"role": "system", "content": "You are a helpful summarization assistant."},
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.7,
        "max_tokens": 1000
    }

    try:
        response = requests.post(GROQ_URL, headers=headers, json=payload)
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
