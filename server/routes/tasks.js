const express = require("express");
const router = express.Router();
const db = require("../db");
const authenticateToken = require("../middleware/auth");

router.use(authenticateToken);

//GET
router.get("/tasks", (req, res) => {
  console.log("GET tasks called");
  const sql = `
  SELECT 
    tasks.*, 
    projects.title AS projectTitle,
    (SELECT COUNT(*) FROM checklist_items WHERE taskId = tasks.id AND isDone = 1) AS completedSubtasks,
    (SELECT COUNT(*) FROM checklist_items WHERE taskId = tasks.id) AS totalSubtasks
  FROM tasks
  LEFT JOIN projects ON tasks.projectId = projects.id
  WHERE tasks.userId = ?
  ORDER BY dateCreated DESC
`;

  db.all(sql, [req.user.userId], (err, rows) => {
    if (err) {
      console.error("Error fetching tasks:", err.message);
      res.status(500).json({ error: "Failed to fetch tasks" });
    } else {
      console.log("tasks have been fetched by user: ", req.user);
      res.json(rows);
    }
  });
});
//POST
router.post("/tasks", (req, res) => {
  const {
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
  const userId = req.user.userId;

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
router.put("/tasks/:id", (req, res) => {
  const { id } = req.params;
  const {
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
  const userId = req.user.userId;

  const sql = `
    UPDATE tasks SET
      projectId = ?, title = ?, description = ?, status = ?, priority = ?,
      category = ?, dueDate = ?, reminderDate = ?, repeat = ?, dateCreated = ?, dateCompleted = ?
    WHERE id = ? AND userId = ?
  `;

  const params = [
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
    userId,
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
router.delete("/tasks/:id", (req, res) => {
  const { id } = req.params;

  const sql = `DELETE FROM tasks WHERE id = ? AND userId = ?`;

  db.run(sql, [id, req.user.userId], function (err) {
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

module.exports = router;
