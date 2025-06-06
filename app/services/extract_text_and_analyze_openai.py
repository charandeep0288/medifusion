# app/services/extract_text_and_analyze_openai.py

import openai
import boto3
from urllib.parse import urlparse
import os

from dotenv import load_dotenv
load_dotenv()

openai.api_key = os.getenv("OPENAI_API_KEY")

def generate_presigned_url(s3_url: str, expiration: int = 300) -> str:
    parsed = urlparse(s3_url)
    bucket = parsed.netloc
    key = parsed.path.lstrip("/")

    s3 = boto3.client("s3")
    return s3.generate_presigned_url(
        "get_object",
        Params={"Bucket": bucket, "Key": key},
        ExpiresIn=expiration
    )

def extract_text_and_analyze_openai(s3_url: str) -> str:
    image_url = generate_presigned_url(s3_url)

    response = openai.ChatCompletion.create(
        model="gpt-4o",
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": "This is a medical document. Extract structured data like PatientName, DateOfBirth, Diagnosis, Medications, DischargeCondition, FollowUp, etc. Return JSON only."
                    },
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": image_url,
                            "detail": "high"
                        }
                    }
                ]
            }
        ],
        max_tokens=2000
    )
    return response.choices[0].message.content