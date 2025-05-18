const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Connect to the database, called checkit.db
const db = new sqlite3.Database("./checkit.db", (err) => {
  if (err) {
    console.error("Error connecting to the database:", err.message);
  } else {
    console.log("Connected to the SQLite database.");
  }
});

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

/////////////////// LANDING API
app.get("/", (req, res) => {
  res.send("Welcome to the CheckIt API!");
});

/////////////////// PROJECTS API

// GET
app.get("/projects", (req, res) => {
  const userId = 1;
  const sql = `SELECT id, title FROM projects WHERE userId = ? ORDER BY dateCreated DESC`;

  db.all(sql, [userId], (err, rows) => {
    if (err) {
      console.error("Error fetching projects:", err.message);
      res.status(500).json({ error: "Failed to fetch projects" });
    } else {
      res.json(rows);
    }
  });
});

// POST
app.post("/projects", (req, res) => {
  const { userId, title, description, dateCreated, dateCompleted } = req.body;

  const sql = `
    INSERT INTO projects (
      userId, title, description,
      dateCreated, dateCompleted
    ) VALUES (?, ?, ?, ?, ?)
  `;

  const params = [userId, title, description, dateCreated, dateCompleted];

  db.run(sql, params, function (err) {
    if (err) {
      console.error("Error creating project:", err.message);
      res.status(500).json({ error: "Failed to create project" });
    } else {
      res.status(201).json({ id: this.lastID });
    }
  });
});

// PUT
app.put("/projects/:id", (req, res) => {
  const { id } = req.params;
  const { userId, title, description, dateCreated, dateCompleted } = req.body;

  const sql = `
    UPDATE projects SET
      userId = ?, title = ?, description = ?,
      dateCreated = ?, dateCompleted = ?
    WHERE id = ?
  `;

  const params = [userId, title, description, dateCreated, dateCompleted, id];

  db.run(sql, params, function (err) {
    if (err) {
      console.error("Error updating project:", err.message);
      res.status(500).json({ error: "Failed to update project" });
    } else {
      res
        .status(200)
        .json({ message: "Project updated", changes: this.changes });
    }
  });
});

// DELETE
app.delete("/projects/:id", async (req, res) => {
  const projectId = req.params.id;

  try {
    // First delete tasks belonging to this project
    await db.run("DELETE FROM tasks WHERE projectId = ?", [projectId]);

    // Then delete the project
    await db.run("DELETE FROM projects WHERE id = ?", [projectId]);

    res.sendStatus(204);
  } catch (err) {
    console.error("Error deleting project and tasks:", err);
    res.status(500).json({ error: "Failed to delete project and tasks" });
  }
});

/////////////////// TASKS API

//GET
app.get("/tasks", (req, res) => {
  const sql = `
    SELECT 
      tasks.*, 
      projects.title AS projectTitle,
      (SELECT COUNT(*) FROM checklist_items WHERE taskId = tasks.id AND isDone = 1) AS completedSubtasks,
      (SELECT COUNT(*) FROM checklist_items WHERE taskId = tasks.id) AS totalSubtasks
    FROM tasks
    LEFT JOIN projects ON tasks.projectId = projects.id
    ORDER BY dateCreated DESC
  `;

  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error("Error fetching tasks:", err.message);
      res.status(500).json({ error: "Failed to fetch tasks" });
    } else {
      res.json(rows);
    }
  });
});
//POST
app.post("/tasks", (req, res) => {
  const {
    userId,
    projectId,
    title,
    description,
    status,
    priority,
    category,
    dueDate,
    reminderDate,
    repeat,
    dateCreated,
  } = req.body;

  const sql = `
    INSERT INTO tasks (
      userId, projectId, title, description, status, priority,
      category, dueDate, reminderDate, repeat, dateCreated
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const params = [
    userId,
    projectId,
    title,
    description,
    status,
    priority,
    category,
    dueDate,
    reminderDate,
    repeat,
    dateCreated,
  ];

  db.run(sql, params, function (err) {
    if (err) {
      console.error("Error creating task:", err.message);
      res.status(500).json({ error: "Failed to create task" });
    } else {
      res.status(201).json({ id: this.lastID });
    }
  });
});
//PUT
app.put("/tasks/:id", (req, res) => {
  const { id } = req.params;
  const {
    userId,
    projectId,
    title,
    description,
    status,
    priority,
    category,
    dueDate,
    reminderDate,
    repeat,
    dateCreated,
    dateCompleted,
  } = req.body;

  const sql = `
    UPDATE tasks SET
      userId = ?, projectId = ?, title = ?, description = ?, status = ?, priority = ?,
      category = ?, dueDate = ?, reminderDate = ?, repeat = ?, dateCreated = ?, dateCompleted = ?
    WHERE id = ?
  `;

  const params = [
    userId,
    projectId,
    title,
    description,
    status,
    priority,
    category,
    dueDate,
    reminderDate,
    repeat,
    dateCreated,
    dateCompleted,
    id,
  ];

  db.run(sql, params, function (err) {
    if (err) {
      console.error("Error updating task:", err.message);
      res.status(500).json({ error: "Failed to update task" });
    } else {
      res.status(200).json({ message: "Task updated", changes: this.changes });
    }
  });
});
//DELETE
app.delete("/tasks/:id", (req, res) => {
  const { id } = req.params;

  const sql = `DELETE FROM tasks WHERE id = ?`;

  db.run(sql, [id], function (err) {
    if (err) {
      console.error("Error deleting task:", err.message);
      res.status(500).json({ error: "Failed to delete task" });
    } else if (this.changes === 0) {
      res.status(404).json({ error: "Task not found" });
    } else {
      res.status(200).json({ message: "Task deleted" });
    }
  });
});

/////////////////// CHECKLIST API

// Get checklist items for a task
app.get("/tasks/:id/checklist", (req, res) => {
  const { id } = req.params;

  // Check if task exists
  db.get(`SELECT id FROM tasks WHERE id = ?`, [id], (err, task) => {
    if (err) {
      console.error("Error checking task existence:", err.message);
      return res.status(500).json({ error: "Database error" });
    }
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    // If task exists, fetch checklist
    const sql = `SELECT * FROM checklist_items WHERE taskId = ?`;
    db.all(sql, [id], (err, rows) => {
      if (err) {
        console.error("Error fetching checklist:", err.message);
        res.status(500).json({ error: "Failed to fetch checklist" });
      } else {
        res.json(rows);
      }
    });
  });
});

// Add a checklist item to a task
app.post("/tasks/:id/checklist", (req, res) => {
  const { id } = req.params;
  const { content, isDone } = req.body;

  const sql = `INSERT INTO checklist_items (taskId, content, isDone) VALUES (?, ?, ?)`;
  db.run(sql, [id, content, isDone ? 1 : 0], function (err) {
    if (err) {
      console.error("Error adding checklist item:", err.message);
      res.status(500).json({ error: "Failed to add checklist item" });
    } else {
      res.status(201).json({ id: this.lastID, content, isDone });
    }
  });
});

// Update a checklist item
app.put("/checklist/:id", (req, res) => {
  const { id } = req.params;
  const { content, isDone } = req.body;

  if (content === undefined) {
    // Only update isDone
    const sql = `UPDATE checklist_items SET isDone = ? WHERE id = ?`;
    db.run(sql, [isDone ? 1 : 0, id], function (err) {
      if (err) {
        console.error("Error updating checklist item:", err.message);
        res.status(500).json({ error: "Failed to update checklist item" });
      } else {
        res.status(200).json({ id, isDone });
      }
    });
  } else {
    // Update both fields
    const sql = `UPDATE checklist_items SET content = ?, isDone = ? WHERE id = ?`;
    db.run(sql, [content, isDone ? 1 : 0, id], function (err) {
      if (err) {
        console.error("Error updating checklist item:", err.message);
        res.status(500).json({ error: "Failed to update checklist item" });
      } else {
        res.status(200).json({ id, isDone, content });
      }
    });
  }
});

// Delete a checklist item
app.delete("/checklist/:id", (req, res) => {
  const { id } = req.params;

  const sql = `DELETE FROM checklist_items WHERE id = ?`;
  db.run(sql, [id], function (err) {
    if (err) {
      console.error("Error deleting checklist item:", err.message);
      res.status(500).json({ error: "Failed to delete checklist item" });
    } else if (this.changes === 0) {
      res.status(404).json({ error: "Checklist item not found" });
    } else {
      res.status(200).json({ message: "Checklist item deleted" });
    }
  });
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
