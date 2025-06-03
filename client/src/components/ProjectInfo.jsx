import { useEffect, useState } from "react";
import { getProject, updateProject } from "../api/projects";

export default function ProjectInfo({
  selectedProjectId,
  projectRefreshTrigger,
  setProjectRefreshTrigger,
  refetchProjects,
}) {
  const [project, setProject] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedDescription, setEditedDescription] = useState("");

  async function handleProjectUpdate(field, value) {
    try {
      if (!project) return;
      const updated = { ...project, [field]: value };
      setProject(updated);
      await updateProject(project.id, updated);
      setProjectRefreshTrigger((prev) => !prev); // trigger sidebar refresh
      refetchProjects();
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
  }, [selectedProjectId, projectRefreshTrigger]);

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
          let newText = e.target.innerText;
          if (newText.length > 19) {
            newText = newText.slice(0, 19);
            e.target.innerText = newText;
          }
          setEditedTitle(newText);
          handleProjectUpdate("title", newText);
        }}
        onInput={(e) => {
          const text = e.target.innerText;
          if (text.length > 19) {
            const trimmed = text.slice(0, 19);
            e.target.innerText = trimmed;
            const range = document.createRange();
            const sel = window.getSelection();
            range.selectNodeContents(e.target);
            range.collapse(false);
            sel.removeAllRanges();
            sel.addRange(range);
          }
        }}
        onKeyDown={(e) => {
          const text = e.target.innerText;
          if (
            text.length >= 100 &&
            ![
              "Backspace",
              "Delete",
              "ArrowLeft",
              "ArrowRight",
              "ArrowUp",
              "ArrowDown",
            ].includes(e.key) &&
            !e.ctrlKey &&
            !e.metaKey
          ) {
            e.preventDefault();
          }
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
          let newText = e.target.innerText;
          if (newText.length > 300) {
            newText = newText.slice(0, 300);
            e.target.innerText = newText;
          }
          setEditedDescription(newText);
          handleProjectUpdate("description", newText);
        }}
        onInput={(e) => {
          const text = e.target.innerText;
          if (text.length > 300) {
            const trimmed = text.slice(0, 300);
            e.target.innerText = trimmed;
            const range = document.createRange();
            const sel = window.getSelection();
            range.selectNodeContents(e.target);
            range.collapse(false);
            sel.removeAllRanges();
            sel.addRange(range);
          }
        }}
        onKeyDown={(e) => {
          const text = e.target.innerText;
          if (
            text.length >= 300 &&
            ![
              "Backspace",
              "Delete",
              "ArrowLeft",
              "ArrowRight",
              "ArrowUp",
              "ArrowDown",
            ].includes(e.key) &&
            !e.ctrlKey &&
            !e.metaKey
          ) {
            e.preventDefault();
          }
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            e.target.blur();
          }
        }}
        style={{ minHeight: "5rem", width: "90%", maxHeight: "15rem" }}
      >
        {editedDescription}
      </p>
    </div>
  );
}
