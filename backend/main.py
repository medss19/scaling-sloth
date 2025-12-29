from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from models import Concept, ConceptCreate, ConceptUpdate

app = FastAPI(title="System Design Notes API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage
concepts_db: dict[int, Concept] = {}
counter = 0


@app.get("/concepts", response_model=list[Concept])
def get_concepts():
    return list(concepts_db.values())


@app.get("/concepts/{concept_id}", response_model=Concept)
def get_concept(concept_id: int):
    if concept_id not in concepts_db:
        raise HTTPException(status_code=404, detail="Concept not found")
    return concepts_db[concept_id]


@app.post("/concepts", response_model=Concept, status_code=201)
def create_concept(concept: ConceptCreate):
    global counter
    counter += 1
    new_concept = Concept(id=counter, **concept.model_dump())
    concepts_db[counter] = new_concept
    return new_concept


@app.put("/concepts/{concept_id}", response_model=Concept)
def update_concept(concept_id: int, concept: ConceptUpdate):
    if concept_id not in concepts_db:
        raise HTTPException(status_code=404, detail="Concept not found")

    existing = concepts_db[concept_id]
    update_data = concept.model_dump(exclude_unset=True)
    updated_concept = existing.model_copy(update=update_data)
    concepts_db[concept_id] = updated_concept
    return updated_concept


@app.delete("/concepts/{concept_id}", status_code=204)
def delete_concept(concept_id: int):
    if concept_id not in concepts_db:
        raise HTTPException(status_code=404, detail="Concept not found")
    del concepts_db[concept_id]
