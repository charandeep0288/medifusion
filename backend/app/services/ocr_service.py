import boto3
import json
import os
import mimetypes
import logging
from dotenv import load_dotenv
from botocore.exceptions import ClientError
from urllib.parse import urlparse

from app.services.ner_openai_service import analyze_medical_document

# Setup logger
logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

# Load AWS credentials
load_dotenv()


class TextractService:
    def __init__(self):
        self.aws_access_key_id = os.getenv("AWS_ACCESS_KEY_ID")
        self.aws_secret_access_key = os.getenv("AWS_SECRET_ACCESS_KEY")
        self.region_name = os.getenv("AWS_REGION", "us-east-1")

        logger.info(f"Using AWS region: {self.region_name}")

        self.textract_client = boto3.client(
            'textract',
            aws_access_key_id=self.aws_access_key_id,
            aws_secret_access_key=self.aws_secret_access_key,
            region_name=self.region_name
        )

    def extract_text_with_textract(self, file_path: str, file_type: str) -> dict:
        """Extract text using AWS Textract and return plain text only."""
        try:
            with open(file_path, 'rb') as document:
                document_bytes = document.read()

            if file_type.lower() in ['image', 'pdf']:
                response = self.textract_client.detect_document_text(
                    Document={'Bytes': document_bytes}
                )
            else:
                logger.warning(f"Unsupported file type: {file_type}")
                return {}

            # Extract text from Textract response
            extracted_lines = []
            for item in response.get('Blocks', []):
                if item['BlockType'] == 'LINE':
                    extracted_lines.append(item['Text'])

            full_text = "\n".join(extracted_lines)

            # Optionally save to file
            with open("textract_output.txt", "w", encoding="utf-8") as f:
                f.write(full_text)

            logger.info(f"Extracted {len(extracted_lines)} lines from document.")

            return {
                "text": full_text,
                "source": file_path
            }

        except ClientError as e:
            logger.error(f"AWS Textract error: {e}")
            return {}
        except Exception as e:
            logger.error(f"Textract extraction failed: {e}")
            return {}