import { authFetch } from "./api";

async function submitProject(formData) {
  const response = await authFetch("http://localhost:3001/projects", {
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

async function getProject(projectId) {
  const response = await authFetch(
    `http://localhost:3001/projects/${projectId}`,
    {
      method: "GET",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to retrieve project");
  }

  const project = await response.json();
  console.log("Here's the json from getProject:", project);
  return project;
}

async function deleteProject(projectId) {
  const response = await authFetch(
    `http://localhost:3001/projects/${projectId}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete project");
  }
}

// probably need an updateProject api call for editing what tasks are in a project

async function updateProject(projectId, updateData) {
  const response = await authFetch(
    `http://localhost:3001/projects/${projectId}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updateData),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update project");
  }

  const updatedProject = await response.json();
  return updatedProject;
}

export { submitProject, deleteProject, getProject, updateProject };
