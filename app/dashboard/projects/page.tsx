"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Project = {
  id: string;
  title: string;
  description: string;
  status: string;
  budget: number;
  clientId: string;
};

const statusOptions = ["active", "completed", "on-hold", "cancelled"];

const statusColors: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-700",
  completed: "bg-blue-100 text-blue-700",
  "on-hold": "bg-amber-100 text-amber-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "active",
    budget: "",
    clientId: "",
  });
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    status: "active",
    budget: "",
    clientId: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/projects");
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const result = await response.json();
        setProjects(result);
      } catch (e) {
        throw new Error(`HTTP error! status: ${e}`);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  async function handleDelete(id: string) {
    const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    setProjects((prev) => prev.filter((item) => item.id !== id));
  }

  async function handleCreate(
    title: string,
    description: string,
    status: string,
    budget: number,
    clientId: string
  ) {
    const res = await fetch("/api/projects/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, status, budget, clientId }),
    });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const newProject = await res.json();
    setProjects((prev) => [...prev, newProject]);
  }

  async function handleUpdate(
    id: string,
    title: string,
    description: string,
    status: string,
    budget: number,
    clientId: string
  ) {
    const res = await fetch(`/api/projects/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, status, budget, clientId }),
    });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    setProjects((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, title, description, status, budget, clientId }
          : p
      )
    );
    setEditingId(null);
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Projects</h1>
          <p className="text-sm text-gray-500 mt-1">
            {projects.length} {projects.length === 1 ? "project" : "projects"}
          </p>
        </div>
        <Button onClick={() => setShowForm((prev) => !prev)}>
          {showForm ? "Cancel" : "+ Add project"}
        </Button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base">New project</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <Label>Title</Label>
                <Input
                  placeholder="Website Redesign"
                  value={form.title}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, title: e.target.value }))
                  }
                />
              </div>
              <div>
                <Label>Client ID</Label>
                <Input
                  placeholder="Client ID"
                  value={form.clientId}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, clientId: e.target.value }))
                  }
                />
              </div>
              <div>
                <Label>Budget ($)</Label>
                <Input
                  type="number"
                  placeholder="1000"
                  value={form.budget}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, budget: e.target.value }))
                  }
                />
              </div>
              <div>
                <Label>Status</Label>
                <select
                  className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm"
                  value={form.status}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, status: e.target.value }))
                  }
                >
                  {statusOptions.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2">
                <Label>Description</Label>
                <Input
                  placeholder="Project description"
                  value={form.description}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
              <Button
                onClick={async () => {
                  await handleCreate(
                    form.title,
                    form.description,
                    form.status,
                    Number(form.budget),
                    form.clientId
                  );
                  setForm({
                    title: "",
                    description: "",
                    status: "active",
                    budget: "",
                    clientId: "",
                  });
                  setShowForm(false);
                }}
              >
                Save project
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {loading && (
        <div className="flex items-center justify-center py-16 text-gray-400 text-sm">
          Loading projects...
        </div>
      )}

      {!loading && projects.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-gray-500 text-sm">No projects yet.</p>
          <p className="text-gray-400 text-xs mt-1">
            Add your first project to get started.
          </p>
        </div>
      )}
      <div className="flex flex-col gap-3">
        {projects.map((project) => (
          <Card key={project.id}>
            <CardContent className="p-4">

              {editingId !== project.id ? (
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-sm text-gray-900">
                          {project.title}
                        </p>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[project.status] ?? "bg-gray-100 text-gray-600"}`}
                        >
                          {project.status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">
                        {project.description}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingId(project.id);
                          setEditForm({
                            title: project.title,
                            description: project.description,
                            status: project.status,
                            budget: String(project.budget),
                            clientId: project.clientId,
                          });
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 border-red-200 hover:bg-red-50"
                        onClick={() => handleDelete(project.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400">
                    Budget: ${project.budget.toLocaleString()}
                  </p>
                </div>
              ) : (
                <div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                    <div>
                      <Label>Title</Label>
                      <Input
                        value={editForm.title}
                        onChange={(e) =>
                          setEditForm((prev) => ({
                            ...prev,
                            title: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div>
                      <Label>Client ID</Label>
                      <Input
                        value={editForm.clientId}
                        onChange={(e) =>
                          setEditForm((prev) => ({
                            ...prev,
                            clientId: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div>
                      <Label>Budget ($)</Label>
                      <Input
                        type="number"
                        value={editForm.budget}
                        onChange={(e) =>
                          setEditForm((prev) => ({
                            ...prev,
                            budget: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div>
                      <Label>Status</Label>
                      <select
                        className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm"
                        value={editForm.status}
                        onChange={(e) =>
                          setEditForm((prev) => ({
                            ...prev,
                            status: e.target.value,
                          }))
                        }
                      >
                        {statusOptions.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <Label>Description</Label>
                      <Input
                        value={editForm.description}
                        onChange={(e) =>
                          setEditForm((prev) => ({
                            ...prev,
                            description: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingId(null)}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={() =>
                        handleUpdate(
                          project.id,
                          editForm.title,
                          editForm.description,
                          editForm.status,
                          Number(editForm.budget),
                          editForm.clientId
                        )
                      }
                    >
                      Save
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}