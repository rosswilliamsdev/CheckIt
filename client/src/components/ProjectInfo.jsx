import { useEffect, useState } from "react";
import { getProject, updateProject } from "../api/projects";

export default function ProjectInfo({ selectedProjectId, refreshTrigger }) {
  const [project, setProject] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedDescription, setEditedDescription] = useState("");

  async function handleProjectUpdate(field, value) {
    try {
      if (!project) return;
      const updated = { ...project, [field]: value };
      setProject(updated);
      await updateProject(project.id, updated);
    } catch (error) {
      console.error("Failed to update project:", error);
    }
  }

  useEffect(() => {
    async function fetchProject() {
      try {
        const data = await getProject(selectedProjectId);
        console.log("Here's the project data:", data);
        setProject(data);
        setEditedTitle(data.title || "");
        setEditedDescription(data.description || "");
      } catch (error) {
        console.error("Error fetching project:", error);
      }
    }

    if (selectedProjectId) {
      fetchProject();
    } else {
      setProject(null);
      setEditedTitle("");
      setEditedDescription("");
    }
  }, [selectedProjectId, refreshTrigger]);

  if (!project || !Array.isArray(project.tasks)) return null;

  const allChecklistItems = project.tasks.flatMap(
    (t) => t.checklistItems || []
  );
  const totalItems = allChecklistItems.length;

  const completedItems = allChecklistItems.filter((c) => c.isDone === 1).length;

  const percentComplete =
    totalItems === 0 ? 0 : Math.round((completedItems / totalItems) * 100);

  return (
    <div className="container d-flex flex-column bg-light-subtle my-4 rounded-4 p-4 align-items-center font-monospace">
      <h2
        className="editable-field"
        contentEditable
        suppressContentEditableWarning
        onBlur={(e) => {
          const newText = e.target.innerText;
          setEditedTitle(newText);
          handleProjectUpdate("title", newText);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            e.target.blur();
          }
        }}
        style={{ minHeight: "3.5rem" }}
      >
        {editedTitle}
      </h2>
      <div className="mb-3">
        <label htmlFor="progress" className="form-label fw-bold">
          Project Progress
        </label>
        <div className="progress" style={{ height: "20px" }}>
          <div
            className={`progress-bar ${
              percentComplete === 100
                ? "bg-success"
                : percentComplete > 50
                ? "bg-warning"
                : "bg-secondary"
            }`}
            role="progressbar"
            style={{ width: `${percentComplete}%` }}
            aria-valuenow={percentComplete}
            aria-valuemin="0"
            aria-valuemax="100"
          >
            {percentComplete}%
          </div>
        </div>
      </div>
      <p
        className="editable-field"
        contentEditable
        suppressContentEditableWarning
        onBlur={(e) => {
          const newText = e.target.innerText;
          setEditedDescription(newText);
          handleProjectUpdate("description", newText);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            e.target.blur();
          }
        }}
        style={{ minHeight: "5rem" }}
      >
        {editedDescription}
      </p>
      <style>
        {`
          .editable-field {
            border: none;
            outline: none;
            border-radius: 0.375rem;
            padding: 0.25rem 0.5rem;
          }
          .editable-field:hover,
          .editable-field:focus {
            border: 1px solid #6c757d;
            background-color: #f8f9fa;
            cursor: text;
          }
        `}
      </style>
    </div>
  );
}
