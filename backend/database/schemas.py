from pydantic import BaseModel
from typing import List, Optional

class PatientData(BaseModel):
    name: str
    dob: Optional[str] = None               # Date of birth in 'YYYY-MM-DD' format
    ssn: Optional[str] = None               # Social Security Number
    insurance_number: Optional[str] = None  # Insurance ID
    medical_conditions: Optional[List[str]] = []    # Medical conditions as list of strings
    address: Optional[str] = None           # Address (optional, may help in fuzzy matching)
    phone: Optional[str] = None             # Phone number
    email: Optional[str] = None             # Email address
    gender: Optional[str] = None   

class FuzzyMatchRequest(BaseModel):
    patients: List[PatientData]
