import './styles.css'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div class="container">
    <h1>To-do List</h1>
    <form>
      <input type="text" id="taskInput" placeholder="Enter a new task...">
      <button class="addbutton" id="addTaskButton">Add</button>
    </form>
    <ul id="taskList"></ul>
  </div>
`

interface Task {
  id: number;
  description: string;
  completed: boolean;
}

let tasks: Task[] = JSON.parse(localStorage.getItem("tasks") || "[]");
displayTasks();

document.querySelector("form")?.addEventListener("submit", e => {
  e.preventDefault();
});

function addTask(description: string): void {
  const task: Task = {
    id: new Date().getTime(),
    description,
    completed: false
  };
  tasks.push(task);
  displayTasks();
  saveTasks();
}

function removeTask(id: number): void {
  tasks = tasks.filter(task => task.id !== id); 
  displayTasks();
  saveTasks();
}

function toggleTask(id: number): void {
  const task = tasks.find(task => task.id === id);
  if (task) {
    task.completed = !task.completed;
    displayTasks();
    saveTasks();
  }
}

function saveTasks(): void {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function displayTasks(): void {
  const taskList = document.getElementById('taskList') as HTMLUListElement;
  taskList.innerHTML = '';

  tasks.forEach(task => {
    const li = document.createElement('li');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.className = 'checkbox';
    checkbox.onclick = () => toggleTask(task.id);

    const description = document.createElement('span');
    description.textContent = task.description;
    description.style.textDecoration = task.completed ? 'line-through' : 'none';
    description.style.color = task.completed ? '#878f99' : 'black';

    const removeButton = document.createElement('button');
    removeButton.textContent = 'x';
    removeButton.onclick = () => removeTask(task.id);

    li.appendChild(checkbox);
    li.appendChild(description);
    li.appendChild(removeButton);
    taskList.appendChild(li);
  });
}

document.getElementById('addTaskButton')?.addEventListener('click', () => {
  const taskInput = document.getElementById('taskInput') as HTMLInputElement;
  const taskDescription = taskInput.value.trim();

  if (taskDescription) {
    addTask(taskDescription);
    taskInput.value = '';
  } else {
    alert('Please enter a task!');
  }
});
