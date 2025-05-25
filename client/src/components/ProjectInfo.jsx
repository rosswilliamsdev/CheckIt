import { useEffect, useState } from "react";
import { getProject } from "../api/projects";

export default function ProjectInfo({ selectedProjectId }) {
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
    }
  }, [selectedProjectId]);

  if (!project) return null; // or a loading spinner/message

  return (
    <div className="container d-flex flex-column bg-light-subtle my-4 rounded-4 p-4 align-items-center font-monospace">
      <h2>{project.title}</h2>
      <p>{project.description}</p>
    </div>
  );
}
