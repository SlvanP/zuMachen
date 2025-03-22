// script.js
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const toggleTheme = document.getElementById('toggleTheme');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks() {
  taskList.innerHTML = '';
  tasks.forEach((task, index) => {
    const li = document.createElement('li');
    if (task.done) li.classList.add('done');

    const span = document.createElement('span');
    span.textContent = task.text;
    span.ondblclick = () => editTask(span, index);
    span.style.flex = '1';

    const deleteBtn = document.createElement('button');
    deleteBtn.innerHTML = '×';
    deleteBtn.onclick = () => {
      tasks.splice(index, 1);
      saveTasks();
      renderTasks();
    };

    li.appendChild(span);
    li.appendChild(deleteBtn);
    li.addEventListener('click', e => {
      if (e.target.tagName !== 'BUTTON' && e.target.tagName !== 'INPUT') {
        task.done = !task.done;
        saveTasks();
        renderTasks();
      }
    });

    taskList.appendChild(li);
  });
}

function addTask() {
  const text = taskInput.value.trim();
  if (!text) return;
  tasks.push({ text, done: false });
  saveTasks();
  renderTasks();
  taskInput.value = '';
  taskInput.focus();
}

function editTask(span, index) {
  const input = document.createElement('input');
  input.value = span.textContent;
  input.classList.add('editing');

  input.onblur = () => {
    tasks[index].text = input.value.trim() || tasks[index].text;
    saveTasks();
    renderTasks();
  };

  input.onkeypress = e => {
    if (e.key === 'Enter') input.blur();
  };

  span.replaceWith(input);
  input.focus();
}

taskInput.addEventListener('keypress', e => {
  if (e.key === 'Enter') addTask();
});

addBtn.addEventListener('click', addTask);

// Theme toggle
toggleTheme.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
});

// Load theme
if (localStorage.getItem('theme') === 'dark') {
  document.body.classList.add('dark');
}

renderTasks();
