const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Connect to SQLite database
const db = new sqlite3.Database("./checkit.db", (err) => {
  if (err) {
    console.error("Error connecting to the database:", err.message);
  } else {
    console.log("Connected to the SQLite database.");
  }
});

// Seed sample data
db.serialize(() => {
  // Seed user
  db.run(
    `INSERT OR IGNORE INTO users (id, email, name) VALUES (1, 'test@example.com', 'Test User')`
  );

  // Seed projects
  db.run(
    `INSERT INTO projects (userId, title, description, dateCreated) VALUES (1, 'Work Project', 'Tasks for work', '2025-05-02')`
  );
  db.run(
    `INSERT INTO projects (userId, title, description, dateCreated) VALUES (1, 'Home Project', 'Chores and errands', '2025-05-02')`
  );

  // Seed tasks
  db.run(`INSERT INTO tasks (userId, projectId, title, description, status, priority, category, dueDate, reminderDate, repeat, dateCreated) VALUES
    (1, 1, 'Finish report', 'Complete the quarterly report', 'in_progress', 'high', 'Work', '2025-05-05', '2025-05-04', 'none', '2025-05-02'),
    (1, 2, 'Grocery shopping', 'Buy groceries for the week', 'pending', 'medium', 'Home', '2025-05-03', '2025-05-03', 'weekly', '2025-05-02')`);

  // Seed checklist for task 1
  db.run(`INSERT INTO checklists (taskId, content, isDone) VALUES 
    (1, 'Collect data', 1),
    (1, 'Write summary', 0),
    (1, 'Review with team', 0)`);
});

/////////////////// LANDING API
app.get("/", (req, res) => {
  res.send("Welcome to the CheckIt API!");
});

/////////////////// TASKS API

//GET
app.get("/tasks", (req, res) => {
  const sql = `
    SELECT 
      tasks.*, 
      projects.title AS projectTitle,
      (SELECT COUNT(*) FROM checklists WHERE taskId = tasks.id AND isDone = 1) AS completedSubtasks,
      (SELECT COUNT(*) FROM checklists WHERE taskId = tasks.id) AS totalSubtasks
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
    const sql = `SELECT * FROM checklists WHERE taskId = ?`;
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

  const sql = `INSERT INTO checklists (taskId, content, isDone) VALUES (?, ?, ?)`;
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
    const sql = `UPDATE checklists SET isDone = ? WHERE id = ?`;
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
    const sql = `UPDATE checklists SET content = ?, isDone = ? WHERE id = ?`;
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

  const sql = `DELETE FROM checklists WHERE id = ?`;
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
