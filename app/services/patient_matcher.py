"""
Patient Matcher Service

This module provides functions to match incoming patient data with existing records
using fuzzy string matching and embedding similarity. It supports parsing incoming
JSON, performing fuzzy and embedding-based matching, and updating or inserting records
in the database.

Functions:
- patient_to_string: Converts a PatientData object to a string for matching.
- parse_incoming_json: Cleans and parses raw JSON into PatientData objects.
- process_fuzzy_match: Matches incoming patients to existing ones using fuzzy and embedding methods.
- find_embedding_match: Finds the best embedding-based match for a patient.

Dependencies:
- Requires database access and utility functions for string matching and embeddings.
"""

from typing import List, Dict
from datetime import datetime
from database.schemas import PatientData
from database.patient_repository import get_all_patients, update_patient, insert_unmatched
from app.utils.string_matcher import is_fuzzy_match
from app.utils.embeddings_utils import get_openai_embedding, cosine_similarity

FUZZY_THRESHOLD = 90
EMBEDDING_THRESHOLD = 0.85

def patient_to_string(patient: PatientData) -> str:
    """
    Convert a PatientData object to a string for matching purposes.

    Args:
        patient (PatientData): The patient data.

    Returns:
        str: Concatenated string of patient attributes.
    """
    return " ".join(filter(None, [
        patient.name,
        patient.dob,
        patient.ssn,
        patient.insurance_number,
        " ".join(patient.medical_conditions) if patient.medical_conditions else "",
        patient.address,
        patient.phone,
        patient.email,
        patient.gender
    ]))

def parse_incoming_json(raw_json: List[dict]) -> List[PatientData]:
    """
    Parse and clean a list of raw JSON objects into PatientData objects.

    Args:
        raw_json (List[dict]): List of raw patient data dictionaries.

    Returns:
        List[PatientData]: List of cleaned PatientData objects.
    """
    cleaned_patients = []

    for item in raw_json:
        try:
            patient = PatientData(
                name=item.get("name", "").strip(),
                dob=item.get("dob"),
                ssn=item.get("ssn"),
                insurance_number=item.get("insurance_number"),
                conditions=item.get("medical_conditions", "")
            )
            cleaned_patients.append(patient)
        except Exception as e:
            print(f"Skipping invalid record: {e}")

    return cleaned_patients

def process_fuzzy_match(patients_json: List[Dict], db) -> Dict:
    existing_patients = get_all_patients(db)
    matched_patients = []
    unmatched_patients = []
    new_patients = []

    for entry in patients_json:
        incoming = entry
        incoming_str = patient_to_string(incoming)

        best_match = None
        best_score = 0
        method = None

        # Fuzzy matching
        for db_patient in existing_patients:
            db_str = f"{db_patient.name} {db_patient.dob or ''} {db_patient.insurance_number or ''} {db_patient.medical_conditions or ''}"
            is_match, score = is_fuzzy_match(db_patient, incoming)
            if is_match and score > best_score:
                best_score = score
                best_match = db_patient
                method = "fuzzy"

        if best_score >= FUZZY_THRESHOLD:
            incoming_data = incoming.dict()

            # Convert dob from string to date object if needed
            if incoming_data.get("dob") and isinstance(incoming_data["dob"], str):
                try:
                    incoming_data["dob"] = datetime.strptime(incoming_data["dob"], "%Y-%m-%d").date()
                except ValueError:
                    incoming_data["dob"] = None  # Or raise an error/log it

            update_patient(db, best_match, incoming_data)

            matched_patients.append({
                "incoming": incoming.dict(),
                "matched_with": best_match.to_dict(),
                "method": method,
                "score": best_score,
                "status": "updated",
                "review_status": "Confirmed" if best_score >= 95 else "Human Review"
            })
            continue

        # Embedding matching
        incoming_embedding = get_openai_embedding(incoming_str)
        emb_best = None
        emb_score = 0

        for db_patient in existing_patients:
            if db_patient.embedding:
                score = cosine_similarity(incoming_embedding, db_patient.embedding)
                if score > emb_score:
                    emb_score = score
                    emb_best = db_patient

        if emb_score >= EMBEDDING_THRESHOLD:
            incoming_data = incoming.dict()

            # Convert dob from string to date object if present
            if incoming_data.get("dob") and isinstance(incoming_data["dob"], str):
                try:
                    incoming_data["dob"] = datetime.strptime(incoming_data["dob"], "%Y-%m-%d").date()
                except ValueError:
                    incoming_data["dob"] = None  # Or handle differently/log error

            update_patient(db, emb_best, incoming_data)

            matched_patients.append({
                "incoming": incoming.dict(),
                "matched_with": emb_best.to_dict(),
                "method": "embedding",
                "score": round(emb_score * 100, 2),
                "status": "updated",
                "review_status": "Confirmed" if emb_score >= 0.95 else "Human Review"
            })

        elif all([incoming.name, incoming.dob, incoming.ssn, incoming.insurance_number]):
            new_patients.append({
                **incoming.dict(),
                "review_status": "Human Review"
            })
        else:
            unmatched_patients.append({
                **incoming.dict(),
                "reason": "no similar match found"
            })

    return {
        "matched_patients": matched_patients,
        "unmatched_patients": unmatched_patients,
        "new_patients": new_patients,
        "summary": {
            "total": len(patients_json),
            "matched": len(matched_patients),
            "unmatched": len(unmatched_patients),
            "new": len(new_patients),
            "review_required": len([m for m in matched_patients if m["review_status"] == "Human Review"]) + len(new_patients),
            "confirmed": len([m for m in matched_patients if m["review_status"] == "Confirmed"])
        }
    }

def find_embedding_match(incoming, db, similarity_threshold=0.85):
    """
    Find the best embedding-based match for an incoming patient.

    Args:
        incoming (PatientData): Incoming patient data.
        db: Database session or connection.
        similarity_threshold (float): Minimum similarity score for a match.

    Returns:
        Tuple: (best_match, best_score)
    """
    incoming_text = f"{incoming.name} {incoming.dob or ''} {incoming.medical_conditions or ''}"
    incoming_embedding = get_openai_embedding(incoming_text)

    existing_patients = get_all_patients(db)
    best_match = None
    best_score = 0

    for patient in existing_patients:
        if patient.embedding:
            score = cosine_similarity(incoming_embedding, patient.embedding)
            if score > similarity_threshold and score > best_score:
                best_match = patient
                best_score = score

    return best_match, best_score