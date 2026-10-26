
import { useState } from "react";
import "./App.css";

function App() {
  const [activePage, setActivePage] = useState("Dashboard");
  const [tasks, setTasks] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [presentations, setPresentations] = useState([]);

  const [taskName, setTaskName] = useState("");
  const [assignmentName, setAssignmentName] = useState("");
  const [subject, setSubject] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [presentationName, setPresentationName] = useState("");

  const menuItems = [
    { name: "Dashboard", icon: "⌂" },
    { name: "Assignments", icon: "▤" },
    { name: "Presentations", icon: "▣" },
    { name: "Daily Tasks", icon: "✓" },
  ];

  function addTask(e) {
    e.preventDefault();
    if (!taskName.trim()) return;

    setTasks([
      ...tasks,
      { id: Date.now(), name: taskName.trim(), completed: false },
    ]);
    setTaskName("");
  }

  function addAssignment(e) {
    e.preventDefault();
    if (!assignmentName.trim() || !subject.trim() || !dueDate) return;

    setAssignments([
      ...assignments,
      {
        id: Date.now(),
        name: assignmentName.trim(),
        subject: subject.trim(),
        dueDate,
      },
    ]);

    setAssignmentName("");
    setSubject("");
    setDueDate("");
  }

  function addPresentation(e) {
    e.preventDefault();
    if (!presentationName.trim()) return;

    setPresentations([
      ...presentations,
      { id: Date.now(), name: presentationName.trim(), completed: false },
    ]);
    setPresentationName("");
  }

  function toggleTask(id) {
    setTasks(tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  }

  function togglePresentation(id) {
    setPresentations(presentations.map((item) =>
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  }

  function removeItem(setter, items, id) {
    setter(items.filter((item) => item.id !== id));
  }

  function renderTasks(limit) {
    const visibleTasks = limit ? tasks.slice(0, limit) : tasks;

    if (visibleTasks.length === 0) {
      return <p className="empty">No tasks yet. Add your first task!</p>;
    }

    return visibleTasks.map((task) => (
      <div className="list-item" key={task.id}>
        <label className="check-label">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => toggleTask(task.id)}
          />
          <span className={task.completed ? "completed" : ""}>
            {task.name}
          </span>
        </label>
        <button
          className="delete-button"
          onClick={() => removeItem(setTasks, tasks, task.id)}
        >
          Delete
        </button>
      </div>
    ));
  }

  function renderAssignments(limit) {
    const visible = limit ? assignments.slice(0, limit) : assignments;

    if (visible.length === 0) {
      return <p className="empty">No assignments added yet.</p>;
    }

    return visible.map((item) => (
      <div className="list-item assignment-item" key={item.id}>
        <div>
          <strong>{item.name}</strong>
          <p>{item.subject} · Due {item.dueDate}</p>
        </div>
        <button
          className="delete-button"
          onClick={() =>
            removeItem(setAssignments, assignments, item.id)
          }
        >
          Delete
        </button>
      </div>
    ));
  }

  function renderPresentations() {
    if (presentations.length === 0) {
      return <p className="empty">No presentation topics added yet.</p>;
    }

    return presentations.map((item) => (
      <div className="list-item" key={item.id}>
        <label className="check-label">
          <input
            type="checkbox"
            checked={item.completed}
            onChange={() => togglePresentation(item.id)}
          />
          <span className={item.completed ? "completed" : ""}>
            {item.name}
          </span>
        </label>
        <button
          className="delete-button"
          onClick={() =>
            removeItem(setPresentations, presentations, item.id)
          }
        >
          Delete
        </button>
      </div>
    ));
  }

  function renderPage() {
    if (activePage === "Assignments") {
      return (
        <section className="panel">
          <h2>My Assignments</h2>
          <p className="muted">Organize your subjects and deadlines.</p>

          <form className="entry-form" onSubmit={addAssignment}>
            <input
              placeholder="Assignment name"
              value={assignmentName}
              onChange={(e) => setAssignmentName(e.target.value)}
              required
            />
            <input
              placeholder="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
            <label className="date-field">
              <span>Due date</span>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
              />
            </label>
            <button type="submit">+ Add Assignment</button>
          </form>

          <div className="list">{renderAssignments()}</div>
        </section>
      );
    }

    if (activePage === "Presentations") {
      return (
        <section className="panel">
          <h2>Presentation Preparation</h2>
          <p className="muted">Keep your presentation topics organized.</p>

          <form className="entry-form" onSubmit={addPresentation}>
            <input
              placeholder="Enter presentation topic"
              value={presentationName}
              onChange={(e) => setPresentationName(e.target.value)}
              required
            />
            <button type="submit">+ Add Topic</button>
          </form>

          <div className="list">{renderPresentations()}</div>
        </section>
      );
    }

    if (activePage === "Daily Tasks") {
      return (
        <section className="panel">
          <h2>My Daily Tasks</h2>
          <p className="muted">Small steps every day lead to big results.</p>

          <form className="entry-form" onSubmit={addTask}>
            <input
              placeholder="What do you need to do?"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              required
            />
            <button type="submit">+ Add Task</button>
          </form>

          <div className="list">{renderTasks()}</div>
        </section>
      );
    }

    return (
      <>
        <section className="welcome">
          <div>
            <span className="eyebrow">YOUR PERSONAL STUDY SPACE</span>
            <h2>Make today count! 🎯</h2>
            <p>
              Keep your assignments, presentations, and college tasks
              organized in one place.
            </p>
            <button onClick={() => setActivePage("Daily Tasks")}>
              + Plan My Day
            </button>
          </div>
          <div className="welcome-art" aria-hidden="true">📚</div>
        </section>

        <section className="stats">
          <article className="stat-card">
            <div className="stat-icon purple">▤</div>
            <p>Total Assignments</p>
            <h3>{assignments.length}</h3>
            <span>Assignments added</span>
          </article>

          <article className="stat-card">
            <div className="stat-icon orange">▣</div>
            <p>Presentations</p>
            <h3>{presentations.length}</h3>
            <span>Topics to prepare</span>
          </article>

          <article className="stat-card">
            <div className="stat-icon green">✓</div>
            <p>Tasks Completed</p>
            <h3>{tasks.filter((task) => task.completed).length}/{tasks.length}</h3>
            <span>Daily task progress</span>
          </article>
        </section>

        <section className="dashboard-grid">
          <article className="panel">
            <div className="panel-heading">
              <div>
                <h3>Recent Assignments</h3>
                <p className="muted">Keep an eye on your deadlines.</p>
              </div>
              <button className="text-button" onClick={() => setActivePage("Assignments")}>
                View all →
              </button>
            </div>
            <div className="list">{renderAssignments(3)}</div>
            <button className="secondary-button" onClick={() => setActivePage("Assignments")}>
              + Add Assignment
            </button>
          </article>

          <article className="panel">
            <div className="panel-heading">
              <div>
                <h3>Today's Tasks</h3>
                <p className="muted">What would you like to finish?</p>
              </div>
              <button className="text-button" onClick={() => setActivePage("Daily Tasks")}>
                View all →
              </button>
            </div>
            <form className="quick-form" onSubmit={addTask}>
              <input
                placeholder="Add a new task..."
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                required
              />
              <button type="submit">Add</button>
            </form>
            <div className="list">{renderTasks(4)}</div>
          </article>
        </section>
      </>
    );
  }

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-logo">A</div>
          <div>
            <h2>AWT Learn</h2>
            <span>Student workspace</span>
          </div>
        </div>

        <p className="menu-label">WORKSPACE</p>

        <nav className="side-menu">
          {menuItems.map((item) => (
            <button
              key={item.name}
              className={activePage === item.name ? "menu-item active" : "menu-item"}
              onClick={() => setActivePage(item.name)}
            >
              <span className="menu-icon">{item.icon}</span>
              {item.name}
            </button>
          ))}
        </nav>

        <div className="sidebar-note">
          <span>💡 Study tip</span>
          <p>Break big assignments into small, manageable tasks.</p>
        </div>

        <div className="profile">
          <div className="avatar">S</div>
          <div>
            <strong>Student</strong>
            <span>My workspace</span>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <p className="breadcrumb">Workspace / {activePage}</p>
            <h1>{activePage}</h1>
          </div>
          <div className="topbar-badge">🎓 Student Portal</div>
        </header>

        <div className="page-content">
          {renderPage()}
        </div>

        <footer className="footer">
          AWT Learn · Your college life, organized.
        </footer>
      </main>
    </div>
  );
}

export default App;
