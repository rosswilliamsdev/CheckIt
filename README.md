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
- **User Authentication**
  - JWT-based login and signup
  - Protected routes for user-specific data
  - Secure task/project ownership scoped to logged-in users
- **Modular Architecture**
  - Modular API helpers and route protection using `authFetch` and middleware

---

## 🧱 Tech Stack

| Layer    | Tech         |
| -------- | ------------ |
| Frontend | React + Vite |
| Styling  | Bootstrap 5  |
| Backend  | Express      |
| DB       | SQLite       |

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

- Sorting tasks in different ways (date, categories)
- Reordering tasks/checklist items by dragging
- Light/dark mode toggle (basic version implemented)
- Offline-first support with localStorage
- drag and drop functionality
