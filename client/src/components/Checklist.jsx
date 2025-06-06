import React, { useEffect, useState, useCallback } from "react";
import ChecklistItemForm from "./ChecklistItemForm";
import {
  deleteChecklistItem,
  toggleChecklistItem,
  updateChecklistContent,
} from "../api/checklist";
import { authFetch } from "../api/api";
import { updateTaskStatus } from "../api/tasks";

// helper function
const calculateStatus = (items) => {
  const total = items.length;
  const completed = items.filter((i) => i.isDone).length;

  if (total === 0) return "pending";
  if (completed === total) return "completed";
  if (completed > 0) return "in_progress";
  return "pending";
};

function Checklist({ taskId, onStatusChange, onChecklistChange }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editedContent, setEditedContent] = useState("");

  async function handleDelete(checklistItem) {
    try {
      await deleteChecklistItem(checklistItem.id);
      setItems((prev) => prev.filter((item) => item.id !== checklistItem.id));
      if (onStatusChange) {
        const newStatus = calculateStatus(
          items.filter((i) => i.id !== checklistItem.id)
        );

        onStatusChange(newStatus);
        updateTaskStatus(taskId, newStatus).catch((err) =>
          console.error("Failed to update task status:", err)
        );
      }
      if (onChecklistChange) onChecklistChange();
    } catch (err) {
      console.error("error deleting task", err);
    }
  }

  const handleCheck = async (itemId) => {
    const updatedItems = items.map((item) =>
      item.id === itemId ? { ...item, isDone: !item.isDone } : item
    );
    setItems(updatedItems);

    try {
      const item = items.find((i) => i.id === itemId);
      if (!item) return;
      await toggleChecklistItem(item);

      if (onStatusChange) {
        const newStatus = calculateStatus(updatedItems);

        onStatusChange(newStatus);
        updateTaskStatus(taskId, newStatus).catch((err) =>
          console.error("Failed to update task status:", err)
        );
      }
      if (onChecklistChange) onChecklistChange();
      // Optional: refetchChecklist(); // only if you really want to confirm
    } catch (err) {
      console.error("Error toggling checklist item:", err);
    }
  };

  const handleEdit = (id, content) => {
    setEditingId(id);
    setEditedContent(content);
  };

  const handleEditSubmit = async (id) => {
    try {
      const item = items.find((i) => i.id === id);
      if (!item) return;
      await updateChecklistContent({
        id,
        content: editedContent,
        isDone: item.isDone,
      });
      setItems((prev) => {
        const updated = prev.map((item) =>
          item.id === id
            ? { ...item, content: editedContent, isDone: item.isDone }
            : item
        );
        // Only recalculate status if isDone changed — in this case it hasn't, so skip it
        return updated;
      });

      setEditingId(null);
      setEditedContent("");

      if (onChecklistChange) onChecklistChange();
    } catch (err) {
      console.error("Failed to update checklist item", err);
    }
  };

  const refetchChecklist = useCallback(() => {
    setLoading(true);
    authFetch(`${import.meta.env.VITE_API_URL}/tasks/${taskId}/checklist`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch checklist");
        return res.json();
      })
      .then((data) => {
        // Only update state if data is different to prevent unnecessary re-renders
        if (JSON.stringify(data) !== JSON.stringify(items)) {
          setItems(data);
        }
      })
      .catch((err) => console.error(err.message))
      .finally(() => setLoading(false));
  }, [taskId, items]);

  const handleNewItem = (newItem) => {
    setItems((prev) => [...prev, newItem]);

    if (onStatusChange) {
      const newStatus = calculateStatus([...items, newItem]);

      onStatusChange(newStatus);
      updateTaskStatus(taskId, newStatus).catch((err) =>
        console.error("Failed to update task status:", err)
      );
    }
    if (onChecklistChange) onChecklistChange();
  };

  useEffect(() => {
    refetchChecklist();
  }, [taskId]);

  // Lightweight key based on the isDone status of all checklist items
  const doneStatusKey = items.map((i) => i.isDone).join(",");

  useEffect(() => {
    if (!onStatusChange) return;

    const newStatus = calculateStatus(items);

    onStatusChange(newStatus);
  }, [doneStatusKey, onStatusChange, taskId]);

  if (loading) return <p>Loading checklist...</p>;

  return (
    <div className="form-slide">
      <h5>Checklist</h5>
      {items.length === 0 && <p>No items in this checklist.</p>}
      <ul className="list-group mt-2">
        {items.map((item) => (
          <li
            key={item.id}
            className="list-group-item d-flex align-items-center"
          >
            <input
              type="checkbox"
              className="form-check-input me-2"
              checked={!!item.isDone}
              onChange={() => handleCheck(item.id)}
            />
            {editingId === item.id ? (
              <input
                type="text"
                className="form-control"
                value={editedContent}
                maxLength={100}
                onChange={(e) => setEditedContent(e.target.value)}
                onBlur={() => handleEditSubmit(item.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleEditSubmit(item.id);
                }}
                autoFocus
              />
            ) : (
              <span onClick={() => handleEdit(item.id, item.content)}>
                {item.content}
              </span>
            )}
            <button
              className="btn btn-sm btn-outline-danger ms-auto"
              onClick={() => handleDelete(item)}
              aria-label="Delete checklist item"
            >
              <i className="bi bi-trash"></i>
            </button>
          </li>
        ))}
      </ul>
      <ChecklistItemForm taskId={taskId} onNewItem={handleNewItem} />
    </div>
  );
}

export default React.memo(Checklist);
