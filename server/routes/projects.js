const express = require("express");
const router = express.Router();
const db = require("../db");

// GET
router.get("/projects", (req, res) => {
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
router.post("/projects", (req, res) => {
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
router.put("/projects/:id", (req, res) => {
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
router.delete("/projects/:id", async (req, res) => {
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

module.exports = router;
