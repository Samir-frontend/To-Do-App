let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

function init() {
  const now = new Date();
  document.getElementById("currentDate").innerText = now.toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric"
  });
  renderTasks();
}

function addTask() {
  const input = document.getElementById("taskInput");
  const priority = document.getElementById("prioritySelect").value;
  const text = input.value.trim();

  if (text === "") {
    input.focus();
    input.style.borderColor = "#ff4d4d";
    setTimeout(() => input.style.borderColor = "rgba(255,255,255,0.15)", 1000);
    return;
  }

  tasks.unshift({
    id: Date.now(),
    text: text,
    priority: priority,
    completed: false
  });

  saveTasks();
  renderTasks();
  input.value = "";
  input.focus();
}

function toggleComplete(id) {
  tasks = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
  saveTasks();
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveTasks();
  renderTasks();
}

function editTask(id) {
  const task = tasks.find(t => t.id === id);
  const newText = prompt("Edit task:", task.text);
  if (newText !== null && newText.trim() !== "") {
    tasks = tasks.map(t => t.id === id ? { ...t, text: newText.trim() } : t);
    saveTasks();
    renderTasks();
  }
}

function clearCompleted() {
  tasks = tasks.filter(t => !t.completed);
  saveTasks();
  renderTasks();
}

function filterTasks(filter, btn) {
  currentFilter = filter;
  document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  renderTasks();
}

function getFilteredTasks() {
  if (currentFilter === "completed") return tasks.filter(t => t.completed);
  if (currentFilter === "pending") return tasks.filter(t => !t.completed);
  if (currentFilter === "high") return tasks.filter(t => t.priority === "high");
  return tasks;
}

function renderTasks() {
  const list = document.getElementById("taskList");
  const emptyMsg = document.getElementById("emptyMsg");
  const filtered = getFilteredTasks();

  list.innerHTML = "";

  if (filtered.length === 0) {
    emptyMsg.style.display = "block";
  } else {
    emptyMsg.style.display = "none";
  }

  filtered.forEach(task => {
    const item = document.createElement("div");
    item.classList.add("task-item");
    if (task.completed) item.classList.add("completed");

    item.innerHTML = `
      <div class="priority-dot ${task.priority}"></div>
      <button class="task-checkbox ${task.completed ? 'checked' : ''}" onclick="toggleComplete(${task.id})">
        ${task.completed ? '✔' : ''}
      </button>
      <span class="task-text">${task.text}</span>
      <div class="task-actions">
        <button class="edit-btn" onclick="editTask(${task.id})">✎</button>
        <button class="delete-btn" onclick="deleteTask(${task.id})">✕</button>
      </div>
    `;

    list.appendChild(item);
  });

  updateStats();
}

function updateStats() {
  const total = tasks.length;
  const done = tasks.filter(t => t.completed).length;
  const pending = total - done;

  document.getElementById("totalCount").innerText = total;
  document.getElementById("doneCount").innerText = done;
  document.getElementById("pendingCount").innerText = pending;
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

document.getElementById("taskInput").addEventListener("keypress", function(e) {
  if (e.key === "Enter") addTask();
});

init();