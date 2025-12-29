from pydantic import BaseModel
from typing import Optional

class ConceptBase(BaseModel):
    title: str
    description: Optional[str] = None
    category: Optional[str] = None  # e.g., "scaling", "database", "caching"

class ConceptCreate(ConceptBase):
    pass

class ConceptUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None

class Concept(ConceptBase):
    id: int

    class Config:
        from_attributes = True
