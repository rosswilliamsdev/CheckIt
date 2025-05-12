# ✅ CheckIt

CheckIt is a full-stack todo list app with support for subtasks, automatic progress tracking, and a clean UI powered by Bootstrap. It’s built with React, Express, and SQLite — designed for developers who want a simple, real-world project that demonstrates clean CRUD architecture and thoughtful UX.

---

## 🚀 Features

- **Task Management**
  - Create, edit, delete tasks
  - Assign due dates, priorities, categories
- **Checklists**
  - Add subtasks (checklist items) to each task
  - Edit checklist item content inline
  - Toggle completion
  - Delete items
- **Smart Task Status**
  - Auto-updates task status based on checklist progress:
    - Pending = 0 checked
    - In Progress = partially checked
    - Completed = all checked
- **Visual UI**
  - Bootstrap icons & styles
  - Expand/collapse checklist views
  - Status badges with color-coded styling
- **Modular Architecture**
  - API helpers separated by domain (`/api/checklist.js`, `/api/tasks.js`)
---

## 🧱 Tech Stack

| Layer    | Tech           |
|----------|----------------|
| Frontend | React + Vite   |
| Styling  | Bootstrap 5    |
| Backend  | Express        |
| DB       | SQLite         |

---

## 🛠 Setup

```bash
# clone the repo
git clone https://github.com/rosswilliamsdev/checkit.git
cd checkit

# install backend dependencies
cd server
npm install

# install frontend dependencies
cd client
npm install
```

## Some Future Ideas:

- Sorting
- Reordering tasks/checklist items
- Light/dark mode toggle
- User accounts & authentication
- Offline-first support with localStorage
