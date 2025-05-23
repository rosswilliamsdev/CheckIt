const express = require("express");
const router = express.Router();
const db = require("../db")

//GET
router.get("/tasks", (req, res) => {
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
router.post("/tasks", (req, res) => {
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
router.put("/tasks/:id", (req, res) => {
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
router.delete("/tasks/:id", (req, res) => {
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

module.exports = router;
