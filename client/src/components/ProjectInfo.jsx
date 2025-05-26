import { useEffect, useState } from "react";
import { getProject } from "../api/projects";

export default function ProjectInfo({ selectedProjectId, refreshTrigger }) {
  const [project, setProject] = useState(null);

  useEffect(() => {
    async function fetchProject() {
      try {
        const data = await getProject(selectedProjectId);
        console.log("Here's the project data:", data);
        setProject(data);
      } catch (error) {
        console.error("Error fetching project:", error);
      }
    }

    if (selectedProjectId) {
      fetchProject();
    } else {
      setProject(null);
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
      <h2>{project.title}</h2>
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
      <p>{project.description}</p>
    </div>
  );
}
