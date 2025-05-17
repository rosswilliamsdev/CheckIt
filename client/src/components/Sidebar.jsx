import Header from "./Header";

function Sidebar({
  projects,
  // setProjects,
  // fetchProjects,
  selectedProjectId,
  setSelectedProjectId,
}) {
  console.log("Sidebar rendering projects:", projects);
  return (
    <div
      className="d-flex flex-column p-3 bg-light-subtle container rounded-4 my-4 mx-1"
      style={{ width: "15rem" }}
    >
      <Header />
      <br />
      <h5 className="mb-4">Active Projects</h5>
      <ul className="nav nav-pills flex-column">
        {projects.map((project) => (
          <li
            className="nav-item my-2 p-1"
            key={project.id}
            onClick={() => setSelectedProjectId(project.id)}
          >
            <a
              href="#"
              className={`nav-link ${
                selectedProjectId === project.id ? "active" : ""
              }`}
            >
              {project.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export { Sidebar };
