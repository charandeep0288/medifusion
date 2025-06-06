import boto3
import time
import json
import os
import mimetypes
import logging
from urllib.parse import urlparse
from dotenv import load_dotenv

from app.services.ner_openai_service import analyze_medical_document


# Setup logger
logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

# Load AWS credentials from .env
load_dotenv()

aws_access_key_id = os.getenv("AWS_ACCESS_KEY_ID")
aws_secret_access_key = os.getenv("AWS_SECRET_ACCESS_KEY")
region_name =  os.getenv("AWS_REGION", "us-east-1")
print(f"Using AWS region: {region_name}")

# Textract client
textract = boto3.client(
    'textract',
    aws_access_key_id=aws_access_key_id,
    aws_secret_access_key=aws_secret_access_key,
    region_name=region_name
)

def parse_s3_url(s3_url: str):
    parsed_url = urlparse(s3_url)
    bucket = parsed_url.netloc
    key = parsed_url.path.lstrip('/')
    return bucket, key

def start_textract_job(bucket: str, key: str, is_pdf: bool):
    """Start an async Textract job for PDFs or images."""
    if is_pdf:
        response = textract.start_document_text_detection(
            DocumentLocation={'S3Object': {'Bucket': bucket, 'Name': key}}
        )
    else:
        response = textract.start_document_text_detection(
            DocumentLocation={'S3Object': {'Bucket': bucket, 'Name': key}}
        )
    return response["JobId"]

def is_job_complete(job_id: str) -> bool:
    while True:
        response = textract.get_document_text_detection(JobId=job_id)
        status = response['JobStatus']
        logger.info(f"Job status: {status}")
        if status in ['SUCCEEDED', 'FAILED']:
            return status == 'SUCCEEDED'
        time.sleep(5)

def get_job_results(job_id: str):
    pages = []
    next_token = None
    while True:
        response = textract.get_document_text_detection(JobId=job_id, NextToken=next_token) if next_token else textract.get_document_text_detection(JobId=job_id)
        pages.append(response)
        next_token = response.get("NextToken")
        if not next_token:
            break
    return pages

def extract_text_from_s3(s3_url: str) -> dict:
    bucket, key = parse_s3_url(s3_url)
    mime_type, _ = mimetypes.guess_type(key)
    is_pdf = mime_type == 'application/pdf'

    job_id = start_textract_job(bucket, key, is_pdf)

    if not is_job_complete(job_id):
        logger.error("Textract job failed or timed out.")
        raise Exception("Textract job failed or timed out.")

    pages = get_job_results(job_id)
    all_lines = []

    json_files = []
    for i, page in enumerate(pages):
        filename = f"textract_output_page_{i+1}.json"
        with open(filename, 'w') as f:
            json.dump(page, f, indent=4)
        json_files.append(filename)

        for block in page.get("Blocks", []):
            if block.get("BlockType") == "LINE":
                all_lines.append(block["Text"])

    with open("textract_output.txt", "w", encoding="utf-8") as f:
        for line in all_lines:
            f.write(line + "\n")

    logger.info(f"Extracted {len(all_lines)} lines from {len(pages)} pages.")
    logger.info(f"Text file saved as textract_output.txt")
    logger.info(f"JSON files: {json_files}")

    # Full Text
    full_text = "\n".join(all_lines)

    # Call NER extractor
    try:
        ner_result = analyze_medical_document(full_text, is_file=False)
    except Exception as e:
        logger.error(f"NER extraction failed: {str(e)}")
        ner_result = {}

    return {
        "text": full_text,
        "structured_data": ner_result,
        "total_pages": len(pages),
        "source": s3_url
    }
