import openai
import os
from dotenv import load_dotenv
from typing import Union
import json
import re

# Load environment variables
load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

# Prompt template
PROMPT_TEMPLATE = """
You are a medical document analysis assistant. Your task is to:
1. Identify the type of medical document (e.g., Prescription, Lab Report, Discharge Summary, etc.).
2. Extract structured information such as patient name, date of birth, MRN, diagnoses, medications, insurance info, and anything else relevant.
3. Return a JSON object with a field "DocumentType" and another field "ExtractedData" containing all relevant key-value pairs.

Text:
\"\"\"
{document_text}
\"\"\"

Return only the JSON object.
"""

def read_txt_input(input_path_or_text: Union[str, os.PathLike], is_file: bool = True) -> str:
    if is_file:
        with open(input_path_or_text, 'r', encoding='utf-8') as f:
            return f.read()
    return input_path_or_text

def extract_ner_with_openai(document: str) -> dict:
    prompt = PROMPT_TEMPLATE.format(document_text=document[:5000])  # truncate long docs if needed

    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "You are an expert in clinical text processing."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.3
    )

    reply = response.choices[0].message.content.strip()

    # Try to isolate JSON if it's wrapped in extra text or backticks
    try:
        json_str = reply
        if "```json" in reply:
            json_str = re.search(r"```json\s*(\{.*\})\s*```", reply, re.DOTALL).group(1)
        elif "{" in reply:
            json_str = reply[reply.index("{"):reply.rindex("}")+1]
        return json.loads(json_str)
    except Exception as e:
        raise ValueError("Failed to parse JSON from OpenAI response:\n" + reply)

def analyze_medical_document(input_path_or_text: Union[str, os.PathLike], is_file: bool = True) -> dict:
    text = read_txt_input(input_path_or_text, is_file)
    result = extract_ner_with_openai(text)
    return result

# Example usage
# if __name__ == "__main__":
#     result = analyze_medical_document("textract output (1).txt", is_file=True)
#     print(json.dumps(result, indent=2))
