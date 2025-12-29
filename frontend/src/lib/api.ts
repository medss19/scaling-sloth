const API_URL = "http://localhost:8000";

export interface Concept {
  id: number;
  title: string;
  description: string | null;
  category: string | null;
}

export interface ConceptCreate {
  title: string;
  description?: string;
  category?: string;
}

export async function getConcepts(): Promise<Concept[]> {
  const res = await fetch(`${API_URL}/concepts`);
  if (!res.ok) throw new Error("Failed to fetch concepts");
  return res.json();
}

export async function getConcept(id: number): Promise<Concept> {
  const res = await fetch(`${API_URL}/concepts/${id}`);
  if (!res.ok) throw new Error("Failed to fetch concept");
  return res.json();
}

export async function createConcept(concept: ConceptCreate): Promise<Concept> {
  const res = await fetch(`${API_URL}/concepts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(concept),
  });
  if (!res.ok) throw new Error("Failed to create concept");
  return res.json();
}

export async function updateConcept(id: number, concept: Partial<ConceptCreate>): Promise<Concept> {
  const res = await fetch(`${API_URL}/concepts/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(concept),
  });
  if (!res.ok) throw new Error("Failed to update concept");
  return res.json();
}

export async function deleteConcept(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/concepts/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete concept");
}
