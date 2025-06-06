from sqlalchemy import Column, Integer, String, Date, Text, JSON
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Patient(Base):
    __tablename__ = "patients"

    id = Column(Integer, primary_key=True)
    name = Column(String)
    dob = Column(Date)
    ssn = Column(String)
    insurance_number = Column(String)
    medical_conditions = Column(String)
    embedding = Column(JSONB, nullable=True)  # Store serialized list as JSON string

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "dob": self.dob.isoformat() if self.dob else None,
            "ssn": self.ssn,
            "insurance_number": self.insurance_number,
            "medical_conditions": self.medical_conditions,
            "embedding": None  # or base64 if needed
        }

class UnmatchedPatient(Base):
    __tablename__ = "unmatched_patients"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    dob = Column(Date, nullable=True)
    ssn = Column(String, nullable=True)
    insurance_number = Column(String, nullable=True)
    medical_conditions = Column(Text, nullable=True)