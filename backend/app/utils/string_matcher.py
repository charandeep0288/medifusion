from fuzzywuzzy import fuzz
from database.models import Patient
from database.schemas import PatientData

def is_fuzzy_match(existing: Patient, incoming: PatientData, threshold=95):
    score = fuzz.token_sort_ratio(existing.name, incoming.name)

    # Additional heuristics to boost confidence
    if incoming.dob and existing.dob and incoming.dob == existing.dob:
        score += 2
    if incoming.ssn and existing.ssn and incoming.ssn == existing.ssn:
        score += 3

    return score >= threshold, score
