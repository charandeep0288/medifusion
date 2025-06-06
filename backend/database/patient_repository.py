from database.models import Patient, UnmatchedPatient
from sqlalchemy.orm import Session

def get_all_patients(db: Session):
    return db.query(Patient).all()

def update_patient(db: Session, existing: Patient, new_data: dict):
    existing.dob = new_data.get("dob", existing.dob)
    existing.ssn = new_data.get("ssn", existing.ssn)
    existing.insurance_number = new_data.get("insurance_number", existing.insurance_number)
    existing.medical_conditions = ",".join(new_data.get("medical_conditions", []))
    db.commit()

def insert_unmatched(db: Session, data: dict):
    new_entry = UnmatchedPatient(
        name=data.get("name"),
        dob=data.get("dob"),
        ssn=data.get("ssn"),
        insurance_number=data.get("insurance_number"),
        medical_conditions=",".join(data.get("medical_conditions", []))
    )
    db.add(new_entry)
    db.commit()
