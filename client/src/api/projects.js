

async function submitProject(formData) {
  const response = await fetch("http://localhost:3001/projects", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    throw new Error("Failed to create project");
  }

  const newProject = await response.json();
  return newProject;
}

async function deleteProject(projectId) {
  const response = await fetch(`http://localhost:3001/projects/${projectId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete project");
  }
}

// probably need an updateProject api call for editing what tasks are in a project

export { submitProject, deleteProject };
