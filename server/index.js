const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const authRoutes = require("./routes/auth");
const checklistRoutes = require("./routes/checklist");
const projectsRoutes = require("./routes/projects");
const tasksRoutes = require("./routes/tasks");
const db = require("./db");
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/projects", projectsRoutes);
app.use("/", checklistRoutes);
app.use("/tasks", tasksRoutes);

db.serialize(() => {
  // Create tables if they don't exist
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    email TEXT,
    name TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY,
    userId INTEGER,
    title TEXT,
    description TEXT,
    dateCreated TEXT,
    dateCompleted TEXT,
    FOREIGN KEY(userId) REFERENCES users(id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY,
    userId INTEGER,
    projectId INTEGER,
    title TEXT,
    description TEXT,
    status TEXT,
    priority TEXT,
    category TEXT,
    dueDate TEXT,
    reminderDate TEXT,
    repeat TEXT,
    dateCreated TEXT,
    dateCompleted TEXT,
    FOREIGN KEY(userId) REFERENCES users(id),
    FOREIGN KEY(projectId) REFERENCES projects(id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS checklist_items (
    id INTEGER PRIMARY KEY,
    taskId INTEGER,
    content TEXT,
    isDone INTEGER,
    FOREIGN KEY(taskId) REFERENCES tasks(id)
  )`);
});

// Seed some sample data
db.get("SELECT COUNT(*) AS count FROM users", (err, row) => {
  if (row.count === 0) {
    db.serialize(() => {
      // Seed user
      db.run(
        `INSERT OR IGNORE INTO users (id, email, name) VALUES (1, 'test@example.com', 'Test User')`
      );

      // Seed projects
      db.run(
        `INSERT INTO projects (userId, title, description, dateCreated) VALUES (1, 'Frontend Redesign', 'Update UI using modern frameworks', '2025-05-02')`
      );
      db.run(
        `INSERT INTO projects (userId, title, description, dateCreated) VALUES (1, 'Backend API Upgrade', 'Refactor and enhance server APIs', '2025-05-02')`
      );

      // Seed tasks for project 1
      db.run(`INSERT INTO tasks (userId, projectId, title, description, status, priority, category, dueDate, reminderDate, repeat, dateCreated) VALUES
        (1, 1, 'Refactor Components', 'Break down UI into reusable components', 'pending', 'high', 'Frontend', '2025-05-05', '2025-05-04', 'none', '2025-05-02'),
        (1, 1, 'Implement Dark Mode', 'Add theme toggle feature', 'in_progress', 'medium', 'Frontend', '2025-05-06', '2025-05-05', 'none', '2025-05-02'),
        (1, 1, 'Optimize CSS', 'Remove unused styles and improve performance', 'pending', 'low', 'Frontend', '2025-05-07', '2025-05-06', 'none', '2025-05-02')`);

      // Seed tasks for project 2
      db.run(`INSERT INTO tasks (userId, projectId, title, description, status, priority, category, dueDate, reminderDate, repeat, dateCreated) VALUES
        (1, 2, 'Add Authentication', 'Integrate JWT-based login', 'pending', 'high', 'Backend', '2025-05-08', '2025-05-07', 'none', '2025-05-02'),
        (1, 2, 'Create Documentation', 'Generate API docs using Swagger', 'in_progress', 'medium', 'Backend', '2025-05-09', '2025-05-08', 'none', '2025-05-02'),
        (1, 2, 'Implement Caching', 'Use Redis to cache frequent queries', 'pending', 'medium', 'Backend', '2025-05-10', '2025-05-09', 'none', '2025-05-02')`);

      // Seed checklist items for each task (3 items per task)
      const checklistData = [
        [1, "Split layout into components", 1],
        [1, "Convert class components to functional", 0],
        [1, "Add PropTypes validation", 0],
        [2, "Create toggle button", 1],
        [2, "Apply dark theme styles", 0],
        [2, "Save preference in local storage", 0],
        [3, "Run CSS audit tool", 1],
        [3, "Remove unused selectors", 0],
        [3, "Minify final stylesheet", 0],
        [4, "Set up user schema", 1],
        [4, "Implement login endpoint", 0],
        [4, "Handle token expiration", 0],
        [5, "Define API schemas", 1],
        [5, "Generate Swagger JSON", 0],
        [5, "Deploy to public docs site", 0],
        [6, "Install Redis package", 1],
        [6, "Add middleware caching layer", 0],
        [6, "Test cache hit/miss behavior", 0],
      ];

      for (const [taskId, content, isDone] of checklistData) {
        db.run(
          `INSERT INTO checklist_items (taskId, content, isDone) VALUES (?, ?, ?)`,
          [taskId, content, isDone]
        );
      }
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// PATCH endpoint to update only the status of a task
app.patch("/tasks/:id/status", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const sql = `UPDATE tasks SET status = ? WHERE id = ?`;

  db.run(sql, [status, id], function (err) {
    if (err) {
      console.error("Error updating task status:", err.message);
      res.status(500).json({ error: "Failed to update task status" });
    } else {
      res.status(200).json({ message: "Task status updated", id, status });
    }
  });
});
