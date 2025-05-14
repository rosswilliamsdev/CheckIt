function Sidebar({ projects, setProjects }) {
  return (
    <div
      className="d-flex flex-column p-3 bg-light"
      style={{ width: "250px", height: "100vh" }}
    >
      <h5 className="mb-4">Projects</h5>
      <ul className="nav nav-pills flex-column">
        <li className="nav-item">
          <a href="#" className="nav-link active">
            Project 1
          </a>
        </li>
        <li className="nav-item">
          <a href="#" className="nav-link">
            Project 2
          </a>
        </li>
        <li className="nav-item">
          <a href="#" className="nav-link">
            Project 3
          </a>
        </li>
      </ul>
    </div>
  );
}

export { Sidebar };
