"use client";

import { useState, useEffect } from "react";
import { Concept, ConceptCreate, getConcepts, createConcept, updateConcept, deleteConcept } from "@/lib/api";

const CATEGORIES = ["scaling", "database", "caching", "networking", "security", "messaging", "other"];

export default function Home() {
  const [concepts, setConcepts] = useState<Concept[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<ConceptCreate>({ title: "", description: "", category: "" });
  const [showForm, setShowForm] = useState(false);

  const fetchConcepts = async () => {
    try {
      const data = await getConcepts();
      setConcepts(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConcepts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateConcept(editingId, form);
      } else {
        await createConcept(form);
      }
      setForm({ title: "", description: "", category: "" });
      setShowForm(false);
      setEditingId(null);
      fetchConcepts();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (concept: Concept) => {
    setEditingId(concept.id);
    setForm({
      title: concept.title,
      description: concept.description || "",
      category: concept.category || "",
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this concept?")) return;
    try {
      await deleteConcept(id);
      fetchConcepts();
    } catch (error) {
      console.error(error);
    }
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm({ title: "", description: "", category: "" });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-neutral-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="border-b bg-white">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <h1 className="text-xl font-semibold text-neutral-900">System Design Notes</h1>
          <p className="text-neutral-500 text-sm mt-1">
            Documenting concepts as I learn them
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Add button */}
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="mb-6 text-sm text-neutral-600 hover:text-neutral-900 underline underline-offset-2"
          >
            + Add concept
          </button>
        )}

        {/* Form */}
        {showForm && (
          <form onSubmit={handleSubmit} className="mb-8 bg-white border rounded-md p-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-neutral-600 mb-1">Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded text-sm text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-400"
                  placeholder="e.g., Load Balancing"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-neutral-600 mb-1">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full px-3 py-2 border rounded text-sm text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-400"
                >
                  <option value="">Select...</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-neutral-600 mb-1">Notes</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded text-sm text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-400 resize-none"
                  rows={4}
                  placeholder="What I learned..."
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-neutral-900 text-white text-sm rounded hover:bg-neutral-800"
                >
                  {editingId ? "Update" : "Save"}
                </button>
                <button
                  type="button"
                  onClick={closeForm}
                  className="px-4 py-2 text-sm text-neutral-600 hover:text-neutral-900"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Concepts list */}
        {concepts.length === 0 ? (
          <p className="text-neutral-400 text-sm">No concepts yet. Start adding what you learn.</p>
        ) : (
          <div className="space-y-3">
            {concepts.map((concept) => (
              <div
                key={concept.id}
                className="bg-white border rounded-md p-4 group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-neutral-900">{concept.title}</h3>
                    {concept.category && (
                      <span className="inline-block mt-1 text-xs text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded">
                        {concept.category}
                      </span>
                    )}
                    {concept.description && (
                      <p className="mt-2 text-sm text-neutral-600 whitespace-pre-wrap">
                        {concept.description}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEdit(concept)}
                      className="text-xs text-neutral-500 hover:text-neutral-700"
                    >
                      edit
                    </button>
                    <button
                      onClick={() => handleDelete(concept.id)}
                      className="text-xs text-red-500 hover:text-red-700"
                    >
                      delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
